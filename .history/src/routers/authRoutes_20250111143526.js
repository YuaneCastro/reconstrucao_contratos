const express = require('express');
const { sendConfirmationCode, validateConfirmationCode } = require('../controllers/authcont');
const router = express.Router();

// Enviar código de confirmação
router.post('/send-code', sendConfirmationCode);
router.post('/validate-code', validateConfirmationCode);

module.exports = router;
