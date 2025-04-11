const express = require('express');
const router = express.Router();
const authController = require('../controllers/cadastrocont');
const authenticateToken = require('../middlewares/auth');

router.get('/cadastro',authenticateToken, authController.telacadastro);
router.post('/cadastro',authenticateToken, authController.cadastrar);

router.get('/set-password/:token', authController.telapass);
router.post('/set-password/:token', authController.setPassword);
router.pos
module.exports = router;
