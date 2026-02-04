const { ProductModel, validateProduct } = require('../model/productModel');

module.exports = {
    test: async (req, res) => {
        res.json({ message: "Product endpoint!" })
    },
    productsList: async (req, res) => {
        try {
            let data = await ProductModel.find({});
            res.json(data);

        } catch (err) {
            console.log(err);
            res.status(500).json({ err })
        }
    },
    singleProduct: async (req, res) => {
        try {
            let data = await ProductModel.findOne({ _id: req.params.id });
            res.json(data);
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ err });
        }
    },
    addNewProduct: async (req, res) => {
        let validBody = validateProduct(req.body);
        if (validBody.error) {
            return res.status(400).json(validBody.error.details);
        }
        try {
            let product = new ProductModel(req.body);
            await product.save();
            res.status(201).json(product);
        } catch (err) {
            console.log(err);
            res.status(500).json({ err });
        }
    },
    editProduct: async (req, res) => {
        let validBody = validateProduct(req.body);
        if (validBody.error) {
            return res.status(400).json(validBody.error.details);
        }
        try {
            let id = req.params.id;
            let data = await ProductModel.updateOne({ _id: id }, req.body);;
            res.json(data);
        }
        catch (err) {
            console.log(err);
            res.status(502).json({ err })
        }
    },
    deleteProduct: async (req, res) => {
        try {
            let id = req.params.id;
            let data = await ProductModel.deleteOne({ _id: id });
            res.json(data);
        }
        catch (err) {
            console.log(err);
            res.status(502).json({ err })
        }
    },
    countProducts: async (req,res) => {
        try {
           const count = await ProductModel.countDocuments();
           res.json({ count: count}) 
        }
         catch (err) {
            console.log(err);
            res.status(500).json({ err }) 
        }
    }
}