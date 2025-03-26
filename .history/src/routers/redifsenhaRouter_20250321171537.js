const express = require('express');
const router = express.Router();
const redifsenhacontroller = require('../controllers/redifsenhaCont')

router.get('/set-password/:token', redifsenhacontroller.telapass);
router.post('/set-password/:token', redifsenhacontroller.setPassword);

module.exports = router;