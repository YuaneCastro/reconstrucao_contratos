const express = require('express');
const router = express.Router();
const telapCont = require('../controllers/telacont');
const verifyToken = require('../authMiddleware');

router.get('/dashboard', verifyToken, telapCont.showtelap);
router.get('/atualizar-informacoes', telapCont.paginaConfiguracoes);
router.get('/logout', telapCont.logout);

router.post('/atualizar-informacoes', telapCont.atualizarUsuario);
router.post('/delete', telapCont.delete);


module.exports = router;
