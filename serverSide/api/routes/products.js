const express = require('express');
const router = express.Router();

const {
    test,
    productsList,
    singleProduct,
    addNewProduct,
    editProduct,
    deleteProduct,
    countProducts,
} = require('../controller/productsController');


router.get('/list', productsList);
router.get('/count', countProducts);
router.get('/single/:id', singleProduct);
router.post('/', addNewProduct);
router.patch('/:id', editProduct);
router.delete('/:id', deleteProduct);


module.exports = router;
