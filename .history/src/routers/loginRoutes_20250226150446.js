const express = require('express');
const router = express.Router();
const authController = require('../controllers/logincont');

router.get('/login', authController.showLoginPage);
router.get('/confirmlog', authController.showVerifyCodePage);

router.post('/login', authController.handleLoginAndVerify);
router.post('/confirmlog', authController.verifyCode);

module.exports = router;