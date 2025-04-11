const express = require('express');
const router = express.Router();
const telapCont = require('../controllers/dashboard');
const authenticateToken = require('../middlewares/auth');
const authorizeRole = require('../middlewares/authorizerole');

// exibir a tela
router.get('/dashboard', authenticateToken, authorizeRole('encarregado'), telapCont.showtelap);
router.get('/logout', authenticateToken, telapCont.logout);

//operacoes da tela
router.post('/atualizar-informacoes', authenticateToken, authorizeRole('coordenador'),telapCont.atualizarUsuario);
router.post('/delete', authenticateToken, authorizeRole('coordenador'), telapCont.delete);

router.get('/atualizar-informacoes', authenticateToken, authorizeRole('coordenador'), telapCont.paginaConfiguracoes);
router.get('/dashboard-cordenacao', authenticateToken, authorizeRole('coordenador'),telapCont.dashboard_cordenacao);

router.get('/Telaerro', telapCont.telaerror);

module.exports = router;