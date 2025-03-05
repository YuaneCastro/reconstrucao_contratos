const express = require('express');
const router = express.Router();
const loginController = require('../controllers/logincont');

router.get('/login', loginController.showLoginPage);
router.post('/login', loginController.handleLogin);

router.get('/confirmlogin',loginController)
router.post('/confirmlogin',log)
module.exports = router;