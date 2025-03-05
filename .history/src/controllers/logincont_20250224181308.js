const { findUserByEmail, deleteVerificationCode, saveVerificationCode, sendVerificationEmail, deleteCode, findCode } = require('../db');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'sua_chave_secreta';

exports.showLoginPage = (req, res) => {
    res.render('login');
};

exports.showVerifyCodePage = (req, res) => {
    res.render('confirmlog');
};

exports.handleLogin = async (req, res) => {
    const { email, senha } = req.body;
    console.log("Recebendo login:", email);

    try {
        const user = await findUserByEmail(email);

        if (!user) {
            console.log("Usuário não encontrado");
            return res.status(401).json({ message: "Usuário não encontrado" });
        }

        const isPasswordValid = bcrypt.compareSync(senha, user.senha_hash);
        if (!isPasswordValid) {
            console.log("Senha incorreta");
            return res.status(401).json({ message: "Email ou senha incorretos" });
        }

        // 🔹 Apagar o código de verificação antes de gerar um novo
        await deleteCode(email);

        console.log("Login bem-sucedido!");
        res.json({ success: true, message: "Login bem-sucedido!" });

    } catch (err) {
        console.error("Erro no login:", err);
        res.status(500).json({ message: "Erro no servidor", error: err.message });
    }
};

exports.checkVerificationCode = async (req, res) => {
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
};