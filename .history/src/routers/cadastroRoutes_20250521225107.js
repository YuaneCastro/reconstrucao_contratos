const express = require('express');
const router = express.Router();
const authController = require('../controllers/cadastrocont');
const authenticateToken = require('../middlewares/auth');
const authorizeRole = require('../middlewares/authorizerole');


router.post('/cadastro',authenticateToken, authorizeRole('administracao', 'secretaria'), authController.cadastrar);

router.get('/set-password/:token', authController.telapass);
router.post('/set-password/:token', authController.setPassword);
module.exports = router;
