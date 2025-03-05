const express = require('express');
const router = express.Router();
const confirmationController = require('../controllers/confirmcont');

router.post('/generate-code', confirmationController.generateAndSendCode);
router.post('/validate-code', confirmationController.validateCode);

module.exports = router;
