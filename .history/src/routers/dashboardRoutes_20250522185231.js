const express = require('express');
const router = express.Router();
const telapCont = require('../controllers/dashboard');
const authenticateToken = require('../middlewares/auth');
const authorizeRole = require('../middlewares/authorizerole');

router.get('/Telaerro', telapCont.telaerror);


// -----------coordenacao--------------
router.get('/dashboard-cordenacao', authenticateToken, authorizeRole('administracao'),telapCont.dashboard_cordenacao);
router.get('/dashboard-secretaria', authenticateToken, authorizeRole('secretaria'),telapCont.dashboard_secretaria);

router.post('/update_student', authenticateToken, authorizeRole('administracao', 'secretaria'), telapCont.update_Student);
router.post('/update_encarregado', authenticateToken, authorizeRole('administracao', 'secretaria'), telapCont.update_encarregado);
router.post('/deletar_encarregados', authenticateToken, authorizeRole('administracao', 'secretaria'), telapCont.deletar);
router.post('/redifinir_senha',authenticateToken, authorizeRole('administracao', 'secretaria'), telapCont.redifinir_senha);

router.post('/enviar_documento',authenticateToken, authorizeRole('administracao'), telapCont.enviar_documento);   
router.post('/guardar_documento',authenticateToken, authorizeRole('administracao'), telapCont.guardar_documentos);
router.post('/associados',authenticateToken, authorizeRole('administracao'), telapCont.encarregados_associados);

//-----------encarregados---------------
router.get('/dashboard', authenticateToken, authorizeRole('encarregado'), telapCont.showtelap);
router.get('/documentos/:id',authenticateToken, authorizeRole('encarregado'), telapCont.buscar_documento);
router.post('/assinar',authenticateToken, authorizeRole('encarregado'), telapCont.assinar_contrato);

module.exports = router;