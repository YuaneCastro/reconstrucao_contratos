const express = require('express');
const router = express.Router();
const cadastrocont = require('../controllers/cadastrocont')

router.get('/register', ca.showRegisterPage);
router.post('/register', registerController.handleRegister);

module.exports = router;