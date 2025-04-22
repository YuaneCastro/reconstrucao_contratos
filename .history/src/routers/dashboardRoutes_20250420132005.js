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
router.post('/enviar_documento',authenticateToken, authorizeRole('coordenador'), telapCont.enviar_documento);

//-----------encarregados---------------
router.get('/dashboard', authenticateToken, authorizeRole('encarregado'), telapCont.showtelap);
router.get('/documentos/:id', async (req, res) => {
    const id = req.params.id;
    const contrato = await db.getContratoPorId(id); // Substitua com sua função real
    if (contrato) {
      res.json({ conteudo: contrato.conteudo }); // "conteudo" deve ser uma coluna no banco
    } else {
      res.status(404).json({ erro: 'Contrato não encontrado' });
    }
  });

module.exports = router;