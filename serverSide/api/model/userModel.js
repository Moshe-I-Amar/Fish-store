const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const { config } = require('../../config/secrets');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    password: String,
    city_name: String,
    street_name: String,
    building_number: String,
    date_created: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin', 'owner']
    },
    // NEW: Add these fields for password reset
    resetPasswordToken: String,
    resetPasswordExpires: Date,
});

exports.UserModel = mongoose.model('users', userSchema);

exports.createToken = (user_id, role) => {
    let token = jwt.sign({ _id: user_id, role: role }, config.token_secret, { expiresIn: '600mins' });
    return token;
}

exports.validateUser = (_reqBody) => {
    let joiSchema = Joi.object({
        name: Joi.string().min(2).max(100).required(),
        email: Joi.string().min(2).max(100).email().required(),
        phone: Joi.string().min(2).max(100).required(),
        password: Joi.string().min(4).max(100).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
            'any.only': 'Passwords do not match'
        }),
    });
    return joiSchema.validate(_reqBody);
}

exports.validateLogin = (_reqBody) => {
    let joiSchema = Joi.object({
        email: Joi.string().min(2).max(100).email().required(),
        password: Joi.string().min(4).max(100).required(),
    })
    return joiSchema.validate(_reqBody);
}

exports.validateOrderUser = (_reqBody) => {
    let joiSchema = Joi.object({
        name: this.validateUser.name,
        email: this.validateUser.email,
        phone: this.validateUser.phone,
        city_name: Joi.string().min(2).max(40).required(),
        street_name: Joi.string().min(1).max(60).required(),
        building_number: Joi.string().min(1).max(100).required(),
    });
    return joiSchema.validate(_reqBody);
}

// NEW: Add these validation functions
exports.validateForgotPassword = (_reqBody) => {
    let joiSchema = Joi.object({
        email: Joi.string().min(2).max(100).email().required(),
    });
    return joiSchema.validate(_reqBody);
}

exports.validateResetPassword = (_reqBody) => {
    let joiSchema = Joi.object({
        otp: Joi.string().length(6).required(),
        password: Joi.string().min(4).max(100).required(),
    });
    return joiSchema.validate(_reqBody);
}