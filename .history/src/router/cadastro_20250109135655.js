const express = require('express');
const router = express.Router();
const casdtro = require('../controllers/cadastrocont')

router.get('/register', registerController.showRegisterPage);
router.post('/register', registerController.handleRegister);

module.exports = router;