const express = require('express');
const router = express.Router();
const telapCont = require('../controllers/telacont');
const authenticateToken = require('../middlewares/auth');

// exibir a tela
router.get('/dashboard', authenticateToken, telapCont.showtelap);
router.get('/atualizar-informacoes', authenticateToken, telapCont.paginaConfiguracoes);
router.get('/logout', authenticateToken, telapCont.logout);
router.get('/outras_opcoes',authenticateToken, telapCont.outrass_opcoes);

//operacoes da tela
router.post('/atualizar-informacoes', authenticateToken, telapCont.atualizarUsuario);
router.post('/delete', authenticateToken, telapCont.delete);

module.exports = router;