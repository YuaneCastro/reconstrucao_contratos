const express = require('express');
const router = express.Router();
const confirmationController = require('../controllers/confirmcont');

// Rota para gerar e enviar o código
router.post('/generate-code', confirmationController.generateAndSendCode);
router.post('/validate-code', confirmationController.validateCode);

module.exports = router;
