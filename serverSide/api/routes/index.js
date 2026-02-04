const express = require('express');
const router = express.Router();

const {
    index,
} = require ('../controller/indexControll')

router.get('/', index);

module.exports = router