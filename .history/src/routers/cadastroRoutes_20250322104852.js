const express = require('express');
const router = express.Router();
const authController = require('../controllers/cadastrocont');

router.get('/cadastro', authController.telacadastro);
router.post('/cadastro', authController.cadastrar);

router.get('/set-password/:token', authController.telapass);
router.post('/set-password/:token', authController.setPassword);

module.exports = router;
