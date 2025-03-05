const express = require('express');
const router = express.Router();
const cadastrocont = require('../controllers/cadastrocont');

// Rota GET para exibir a página de cadastro
router.get('/cadastro', cadastrocont.showRegisterPage);

// Rota POST para processar o cadastro
router.post('/cadastro', cadastrocont.handleRegister);

module.exports = router;
