const express = require('express');
const router = express.Router();
const authController = require('../controllers/logincont');
const authenticateToken = require('../middlewares/auth');

router.get('/login', authController.showLoginPage);
router.get('/confirmlog',authenticateToken, authController.showVerifyCodePage);

router.post('/login', authController.handleLogin);
router.post('/confirmlog', authenticateToken,authController.verifyCode);

module.exports = router;