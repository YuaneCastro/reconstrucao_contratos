const express = require('express');
const router = express.Router();
const authController = require('../controllers/cadastrocont');

router.get('/cadastro', authController.telacadastro);
router.post('/cadastro', authController.handleRegister);

module.exports = router;
