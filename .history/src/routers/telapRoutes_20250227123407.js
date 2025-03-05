const express = require('express');
const router = express.Router();
const telapCont = require('../controllers/telacont');
const verifyToken = require('../authMiddleware');

router.get('/dashboard', verifyToken, telapCont.showtelap); // Nome correto da função

module.exports = router;
