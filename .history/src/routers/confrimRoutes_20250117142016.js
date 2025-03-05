const express = require('express');
const router = express.Router();
const confirmcontroller = require('../controllers/confirmcont')

router.get('/confirm', authController.showConfirmationPage);
router.post('/confirm', authController.handleConfirmation);