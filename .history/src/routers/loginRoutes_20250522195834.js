const express = require('express');
const router = express.Router();
const authController = require('../controllers/logincont');

// encarregados
router.get('/login', authController.tela_login_ecarregados);
router.get('/confirmlog', authController.tela_verificacao_code_encarregados);

router.post('/login', authController.fazer_login);
router.post('/confirmlog', authController.verificar_code);


//complexo escolar
router.get('/login-direcao', authController.tela_login_direcao);
router.post('/login-direcao',authController.login_direcao);

router.post("/confirmar-codigo", authController.verificar_login_direcao);



module.exports = router;