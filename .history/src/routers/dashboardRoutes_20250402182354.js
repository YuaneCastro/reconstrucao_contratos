const express = require('express');
const router = express.Router();
const telapCont = require('../controllers/dashboard');
const authenticateToken = require('../middlewares/auth');
const authorizeRole = require('../middlewares/authorizerole');

// exibir a tela
router.get('/dashboard', telapCont.showtelap);
router.get('/atualizar-informacoes', authenticateToken, telapCont.paginaConfiguracoes);
router.get('/logout', authenticateToken, telapCont.logout);
router.get('/outras_operacoes', authenticateToken, telapCont.outras_operacoes);

//operacoes da tela
router.post('/atualizar-informacoes', authorizeRole('coordenador'), authenticateToken, telapCont.atualizarUsuario);
router.post('/delete', authorizeRole('coordenador'), authenticateToken, telapCont.delete);


router.get('/dashboard-cordenacao', authenticateToken, telapCont.dashboard_cordenacao);
router.get('/Telaerro', telapCont.telaerror);

module.exports = router;