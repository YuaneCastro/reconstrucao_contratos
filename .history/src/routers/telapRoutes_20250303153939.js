const express = require('express');
const router = express.Router();
const verifyToken = require('../');
const telacont = require('../controllers/telacont');

router.get('/dashboard', verifyToken, telacont.showtelap);

module.exports = router;
