const express = require('express');
const router = express.Router();
const verifyToken = require('../authMiddleware');
const telacont = require('../controllers/telacont');

router.get('/dashboard', verifyToken, telacont.showtelap);

module.exports = router;
