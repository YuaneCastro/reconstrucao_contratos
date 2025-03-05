const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authenticateToken');
const telacont = require('../controllers/telacont');

router.get('/dashboard', verifyToken, telacont.showtelap);

module.exports = router;
