const express = require('express');
const router = express.Router();
const cadastrocont = require('../controllers/cadastrocont')

router.get('/castro', cadastrocont.showRegisterPage);
router.post('/register', cadastrocont.handleRegister);

module.exports = router;