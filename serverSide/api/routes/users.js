const express = require('express');
const { authAdmin } = require('../../middlewares/authentication')
const router = express.Router();

const {
    testEndpoint,
    usersList,
    countUsers,
    userSignUp,
    userLogIn,
    checkToken,
    forgotPassword,
    resetPassword,
} = require('../controller/userController');

router.get('/', testEndpoint);
router.get('/list', usersList);
router.get('/count',countUsers);
router.get('/checkToken',authAdmin, checkToken);
router.post('/', userSignUp);
router.post('/login', userLogIn);
router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword', resetPassword);

module.exports = router;