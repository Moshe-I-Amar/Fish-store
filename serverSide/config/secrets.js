require('dotenv').config();
exports.config = {
    token_secret: process.env.SECRET_TOKEN,
    db_url: process.env.DB_URL,
    email_address : process.env.EMAIL_USER,
    email_password: process.env.EMAIL_PASS
}