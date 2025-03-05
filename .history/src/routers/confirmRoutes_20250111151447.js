// routes/confirmRoutes.js
const express = require('express');
const router = express.Router();
const confirmController = require('../controllers/confirmcont');

// Rota para confirmar o código
router.post('/confirm', confirmController.confirmCode);

module.exports = router;
