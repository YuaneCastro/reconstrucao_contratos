const express = require('express');
const router = express.Router();
const confirmlogcontroller = require('../controllers/confirmlog'); // Importa o controlador de confirmlog

// Rota para exibir a página de confirmação
router.get('/confirmlog', confirmlogcontroller.showpageconflogin);

// Rota para processar a confirmação do código (POST)
router.post('/confirmlog', confirmlogcontroller.confirmCodelogin);

module.exports = router;
