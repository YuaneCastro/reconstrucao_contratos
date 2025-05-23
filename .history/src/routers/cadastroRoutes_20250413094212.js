const express = require('express');
const router = express.Router();
const authController = require('../controllers/cadastrocont');
const authenticateToken = require('../middlewares/auth');

router.post('/cadastro',authenticateToken, authController.cadastrar);

router.get('/set-password/:token', authenticateToken,authController.telapass);
router.post('/set-password/:token', ,authController.setPassword);
module.exports = router;
