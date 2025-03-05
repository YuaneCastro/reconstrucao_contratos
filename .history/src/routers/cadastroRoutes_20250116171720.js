const express = require('express');
const router = express.Router();
const authController = require('../controllers/cadastrocont');

router.get('/', authController.showRegisterPage);
router.post('/cadastro', authController.handleRegister);

router.get('/confirm', authController.showConfirmationPage);
router.post('/confirm', authController.handleConfirmation);
module.exports = router;
