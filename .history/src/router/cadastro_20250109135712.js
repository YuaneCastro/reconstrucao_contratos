const express = require('express');
const router = express.Router();
const cadastrocont = require('../controllers/cadastrocont')

router.get('/register', cadastrocont.showRegisterPage);
router.post('/register', cas.handleRegister);

module.exports = router;