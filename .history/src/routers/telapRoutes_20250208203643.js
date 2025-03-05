const express = require('express');
const router = express.Router();
const telaCont = require('../controllers/telacont');
const verifyToken = require('../authMiddleware')

router.get('/telap',verifyToken, telac);

module.exports = router;