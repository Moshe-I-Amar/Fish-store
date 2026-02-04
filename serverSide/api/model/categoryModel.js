const mongoose = require('mongoose');
const Joi = require('joi');

const categorySchema = new mongoose.Schema({
    name: String,
    cat_url: String,
    image:String
})

exports.CategoryModel = mongoose.model('categories', categorySchema);

exports.validateCategory = (_reqBody) => {
    let joiSchema = Joi.object({
        name: Joi.string().min(1).max(60).required(),
        cat_url: Joi.string().min(1).max(40).required(),
        image: Joi.string().max(700).allow(null, ''),
    })
    return joiSchema.validate(_reqBody);
}
