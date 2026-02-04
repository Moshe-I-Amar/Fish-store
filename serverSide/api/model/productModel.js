const mongoose = require('mongoose');
const Joi = require('joi');

const productSchema = new mongoose.Schema({
    name: String,
    cat_url: String,
    image: String,
    price: Number,
    amount: Number
})

exports.ProductModel = mongoose.model('products', productSchema);

exports.validateProduct = (_reqBody) => {
    let joiSchema = Joi.object({
        name: Joi.string().min(2).max(100).required(),
        cat_url: Joi.string().min(1).max(100).required(),
        image: Joi.string().min(1).max(700).required(),
        price: Joi.number().min(1).max(900).required(),
        amount: Joi.number().min(1).max(900).allow(null, ''),
    })
    return joiSchema.validate(_reqBody);
}
