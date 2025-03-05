const express = require('express');
const router = express.Router();
const telapCont = require('../controllers/telacont');
const verifyToken = require('../z');

router.get('/dashboard', verifyToken, telapCont.showtelap);

module.exports = router;
