const express = require('express');
const router = express.Router();
const cadastrocont = require('../controllers/cadastrocont')

router.get('/cas', cadastrocont.showRegisterPage);
router.post('/register', cadastrocont.handleRegister);

module.exports = router;