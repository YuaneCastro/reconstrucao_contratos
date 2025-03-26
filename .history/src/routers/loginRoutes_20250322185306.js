const express = require('express');
const router = express.Router();
const authController = require('../controllers/logincont');
// encarregados
router.get('/login', authController.tela_login_ecarregados);
router.get('/confirmlog', authController.tela_verificacao_code_encarregados);
router.get('/login-cordenacao', authController.tela_login_cordenacao)

router.post('/login', authController.fazer_login);
router.post('/confirmlog', authController.verificar_code);
router.post('')

//complexo escolar

module.exports = router;