const express = require('express');
const router = express.Router();
const confirmationController = require('../controllers/confirmci');

// Rota para gerar e enviar o código
router.post('/generate-code', confirmationController.generateAndSendCode);

// Rota para validar o código
router.post('/validate-code', confirmationController.validateCode);

module.exports = router;
