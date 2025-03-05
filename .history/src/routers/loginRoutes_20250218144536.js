const express = require('express');
const router = express.Router();
const loginController = require('../controllers/logincont');

router.get('/login', loginController.showLoginPage);
router.post('/login', loginController.handleLogin);

http://localhost:3000
module.exports = router;