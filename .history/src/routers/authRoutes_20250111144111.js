const express = require('express');
const { sendConfirmationCode, validateConfirmationCode } = require('../controllers/authcont');
const router = express.Router();

router.get('/tela', showRegisterPage)
router.post('/send-code', sendConfirmationCode);
router.post('/validate-code', validateConfirmationCode);

module.exports = router;
