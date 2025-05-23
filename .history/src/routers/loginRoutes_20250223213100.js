const express = require('express');
const router = express.Router();
const loginController = require('../controllers/logincont');
const validateRequest = require('../middlewares/validateRequest');

router.get('/login', loginController.showLoginPage);
router.post('/login', loginController.handleLogin);

router.get('/confirmlogin',loginController.showVerifyCode);
router.post('/verify', loginController.verifyCode);

module.exports = router;