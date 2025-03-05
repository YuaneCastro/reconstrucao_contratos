// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authcont');

// Rota para o cadastro do usuário
router.post('/register', authController.registerUser);

module.exports = router;
