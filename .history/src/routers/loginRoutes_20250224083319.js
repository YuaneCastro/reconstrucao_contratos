const express = require('express');
const router = express.Router();
const authController = require('../controllers/logincont');

router.get('/login', authController.showLoginPage);
router.get('/confirmlogin', authController.showVerifyCodePage);

router.post('/login', authController.handleLogin);
router.post('/confirmlogin', authController.verifyCode);
module.exports = router;