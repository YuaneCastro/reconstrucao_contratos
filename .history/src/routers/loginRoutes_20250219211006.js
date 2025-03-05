const express = require('express');
const router = express.Router();
const loginController = require('../controllers/logincont');
const module.exports = (req, res, next) => {
    let body = '';

    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            req.body = JSON.parse(body || '{}'); // Garante que sempre tenha um objeto
        } catch (error) {
            return res.status(400).json({ message: "Erro ao processar JSON" });
        }

        if (!req.body.email || !req.body.codigo) {
            return res.status(400).json({ message: "Email e código são obrigatórios." });
        }

        next();
    });
};


router.get('/login', loginController.showLoginPage);
router.post('/login', loginController.handleLogin);

router.get('/confirmlogin',loginController.showVerifyCode);
router.post('/verify',loginController.verifyCode);

module.exports = router;