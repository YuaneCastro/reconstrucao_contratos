const express = require('express');
const router = express.Router();
const authController = require('../controllers/cadastrocont');

router.get('/registrar', authController.showRegisterPage);
router.post('/registrar, authController.handleRegister);

router.get('/confirm', authController.showConfirmationPage);
router.post('/confirm', authController.handleConfirmation);
module.exports = router;
