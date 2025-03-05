const express = require('express');
const router = express.Router();
const telapCont = require('../controllers/telacont');
const verifyToken = require('../authMiddleware');

router.get('/', verifyToken, telapCont.showtelap);

module.exports = router;
