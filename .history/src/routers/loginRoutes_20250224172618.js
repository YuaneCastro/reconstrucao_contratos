const express = require('express');
const router = express.Router();
const authController = require('../controllers/logincont');

router.get('/login', authController.showLoginPage);
router.get('/confirmlog', authController.showVerifyCodePage);

router.post('/login', authController.handleLogin);
router.post('/confirmlog', authController.exports.checkVerificationCode = async (req, res) => {
    const { email, code } = req.body;

    try {
        const result = await verifyVerificationCode(email, code);
        if (!result.success) {
            return res.status(400).json({ message: result.message });
        }

        // Se o código for válido, você pode ativar a conta ou permitir o login
        res.json({ success: true, message: "Código verificado! Conta ativada." });
        
    } catch (error) {
        console.error("Erro ao verificar código:", error);
        res.status(500).json({ message: "Erro no servidor" });
    }
};);

module.exports = router;