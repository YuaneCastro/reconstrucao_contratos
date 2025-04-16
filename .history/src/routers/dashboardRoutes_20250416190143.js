const express = require('express');
const router = express.Router();
const telapCont = require('../controllers/dashboard');
const authenticateToken = require('../middlewares/auth');
const authorizeRole = require('../middlewares/authorizerole');

router.get('/Telaerro', telapCont.telaerror);


// -----------coordenacao--------------
router.get('/dashboard-cordenacao', authenticateToken, authorizeRole('coordenador'),telapCont.dashboard_cordenacao);
router.post('/update_student', authenticateToken, authorizeRole('coordenador'), telapCont.update_Student);
router.post('/update_encarregado', authenticateToken, authorizeRole('coordenador'), telapCont.update_encarregado);
router.post('/deletar_encarregados', authenticateToken, authorizeRole('coordenador'), telapCont.deletar);
router.post('/redifinir_senha',authenticateToken, authorizeRole('coordenador'), telapCont.redifinir_senha);
router.post('/enviar_contrato',authenticateToken, au)

//-----------encarregados---------------
router.get('/dashboard', authenticateToken, authorizeRole('encarregado'), telapCont.showtelap);

module.exports = router;