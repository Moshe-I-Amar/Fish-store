const bcrypt = require("bcrypt");
const {
  UserModel,
  validateUser,
  validateLogin,
  createToken,
  validateOrderUser,
  validateForgotPassword,
  validateResetPassword,
} = require("../model/userModel");
const nodemailer = require("nodemailer");
require("dotenv").config();

module.exports = {
  // Test endpoint to check if the users route is working
  testEndpoint: async (req, res) => {
    res.json({ message: "Users endpoint!" });
  },

  // Retrieve all users from the database
  usersList: async (req, res) => {
    try {
      let data = await UserModel.find({});
      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(502).json({ error });
    }
  },

  // Register a new user
  userSignUp: async (req, res) => {
    let validBody = validateUser(req.body);
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }
    try {
      let existingUser = await UserModel.findOne({ email: req.body.email });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "User with this email already exists" });
      }
      let user = new UserModel(req.body);
      user.password = await bcrypt.hash(user.password, 10);
      await user.save();
      user.password = "****";
      res.json(user);
    } catch (error) {
      if (error.code === 11000) {
        return res
          .status(400)
          .json({ message: "Email already registered", code: 11000 });
      }
      console.log(error);
      res.status(502).json({ error });
    }
  },

  // Authenticate user login
  userLogIn: async (req, res) => {
    let validBody = validateLogin(req.body);
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }
    try {
      let user = await UserModel.findOne({ email: req.body.email });
      if (!user) {
        return res.status(401).json({ msg: "Email or Password Wrong!" });
      }
      let validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        return res.status(401).json({ msg: "Email or Password Wrong!" });
      }
      let token = createToken(user._id, user.role, user.name);
      res.json({ token, role: user.role, name: user.name, userId: user._id });
    } catch (error) {
      console.log(error);
      res.status(502).json({ error });
    }
  },

  // Verify user token
  checkToken: async (req, res) => {
    try {
      res.json(req.tokenData);
    } catch (error) {
      console.log(error);
      res.status(502).json({ error });
    }
  },

  // Handle user order (implementation needed)
  userOrder: async (req, res) => {
    let validBody = validateOrderUser(req.body);
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }
    try {
      let newOrder = await UserModel;
      // Implementation needed
    } catch (error) {
      console.log(error);
      res.status(502).json({ error });
    }
  },

  // Handle forgot password request
  forgotPassword: async (req, res) => {
    let validBody = validateForgotPassword(req.body);
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }
    try {
      const user = await UserModel.findOne({ email: req.body.email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Generate a 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000);
      user.resetPasswordToken = otp.toString();
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      await user.save();

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        to: user.email,
        from: process.env.EMAIL_USER,
        subject: "Password Reset",
        text: `Your One-Time Password (OTP) for password reset is: ${otp}\n\n
               This OTP will expire in 1 hour.\n\n
               If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error("Error occurred while sending email:", err);
          return res.status(500).json({
            message: "Failed to send email",
            error: err.message,
          });
        }
        console.log("Email sent: " + info.response);
        res.json({
          message: `An email with a 6-digit OTP has been sent to ${user.email}.`,
        });
      });
    } catch (error) {
      console.log("Server error:", error);
      res
        .status(502)
        .json({ error: "Something went wrong, please try again." });
    }
  },

  // Reset password using OTP
  resetPassword: async (req, res) => {
    let validBody = validateResetPassword(req.body);
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }
    try {
      const user = await UserModel.findOne({
        resetPasswordToken: req.body.otp,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) {
        return res
          .status(400)
          .json({ message: "OTP is invalid or has expired." });
      }

      user.password = await bcrypt.hash(req.body.password, 10);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      await user.save();

      res.json({ message: "Password has been reset successfully" });
    } catch (error) {
      console.log(error);
      res.status(502).json({ error });
    }
  },

  countUsers: async (req,res)=>{
    try{
      const count = await UserModel.countDocuments();
      res.json({count: count});
    }
    catch(err){
      console.log(err);
      res.status(500).json({err})
    }
  }
};
