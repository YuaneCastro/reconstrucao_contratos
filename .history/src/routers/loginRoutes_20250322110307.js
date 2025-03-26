const express = require('express');
const router = express.Router();
const authController = require('../controllers/logincont');
// encarregados
router.get('/login', authController.tela_login_ecarregados);
router.get('/confirmlog', authController.tela_verificacao_code_encarregados);

router.post('/login', authController. ,fazerlogin);
router.post('/confirmlog', authController.verifyCode);


//complexo escolar

module.exports = router;