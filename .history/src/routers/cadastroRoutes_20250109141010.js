const express = require('express');
const router = express.Router();
const cadastrocont = require('../controllers/cadastrocont');

router.get('/cadastro', cadastrocont.showRegisterPage);
router.post('/cadastro', cadastrocont.handleRegister);

module.exports = router;
