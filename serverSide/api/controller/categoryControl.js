const { CategoryModel, validateCategory } = require('../model/categoryModel')

module.exports = {
    testEndpoint: async (req, res) => {
        res.json({ message: "Categories endpoint!" })
    },
    categoriesList: async (req, res) => {
        try {
            let data = await CategoryModel.find({})
            res.status(200).json(data)
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ err })

        }
    }, 
    singleCategory: async (req, res) => {
        try {
            let data = await CategoryModel.findOne({ _id: req.params.id });
            res.json(data);
        }
        catch (err) {
            console.log(err);
            res.status(502).json(err);

        }
    },
    addNewCategory: async (req, res) => {
        let validBody = validateCategory(req.body);
        if (validBody.error) {
            return res.status(400).json(validBody.error.details);
        }
        try {
            const existingCategory = await CategoryModel.findOne({ name: req.body.name });

            if (existingCategory) {
                return res.status(400).json({ message: "You have the same category" });
            }
            let category = new CategoryModel(req.body);
            await category.save();
            res.status(201).json(category);
        }
        catch (err) {
            console.log(err);
            res.status(502).json({ err })
        }
    },
    editCategory: async (req, res) => {
        let validBody = validateCategory(req.body);
        if (validBody.error) {
            return res.status(400).json(validBody.error.details);
        }
        try {
            let id = req.params.id;
            let data = await CategoryModel.updateOne({ _id: id }, req.body);
            res.json(data);
        }
        catch (err) {
            console.log(err);
            res.status(502).json({ err })
        }
    },
    deleteCategory: async (req, res) => {
        try {
            let id = req.params.id;
            let data = await CategoryModel.deleteOne({ _id: id });
            res.json(data);
        }
        catch (err) {
            console.log(err);
            res.status(502).json({ err })
        }
    },
    countCategories: async (req, res) => {
        try {
           const count = await CategoryModel.countDocuments();
           res.json({count: count}); 
        } catch (error) {
            console.log(error);
            res.status(500).json({error})
        }
    }
}