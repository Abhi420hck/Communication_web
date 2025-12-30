const express = require('express');
const {registerUser,userAuth} = require('../controllers/userController');

const router = express.Router();
router.route('/').post(registerUser);
router.route('/login').post(userAuth);

module.exports = router;