const express = require('express');
const router = express.Router();
const cadastroCont = require('../controllers/cadastrocont')

router.get('/register', registerController.showRegisterPage);
router.post('/register', registerController.handleRegister);
module.exports = router;