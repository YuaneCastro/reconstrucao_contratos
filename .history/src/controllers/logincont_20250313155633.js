const { findUserByEmail,verifyUserLogin, deleteVerificationCode, saveVerificationCode, verifyVerificationCode} = require('../db');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;


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
            return res.status(401).json({ message: 'Usuário não encontrado' });
        }

        const senha_has = user?.senha_hash

        if (!user.senha_hash) {
            console.log("Erro: senha_hash não encontrada no banco!");
            return res.status(500).json({ message: 'Erro interno no servidor' });
        }

        const isPasswordValid = await bcrypt.compare(senha, senha_has);
        if (!isPasswordValid) {
            console.log("Senha incorreta");
            return res.status(401).json({ message: 'Email ou senha incorretos' });
        }

        await deleteVerificationCode(email);
        res.clearCookie("tempToken");
        const verificationCode = Math.floor(100000 + Math.random() * 900000);
        const hashcode = await bcrypt.hash(confirmationCode, 10);
        const expiration = new Date(Date.now() + 5 * 60 * 1000);

        console.log(`Salvando código ${verificationCode} para o email ${email} com expiração em ${expiration}`);
        await saveVerificationCode(email, verificationCode, expiration);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Confirmação de login',
            text: `Seu código de confirmação é: ${verificationCode}`,
        });

        const tempToken = jwt.sign({ email }, SECRET_KEY, { expiresIn: "5m" });
        res.cookie("tempToken", tempToken, { httpOnly: true, secure: true,  maxAge: 5 * 60 * 1000 });
       
        res.json({ success: true, message: "Login bem-sucedido!" });
    } catch (err) {
        console.error('Erro no login:', err); 
        res.status(500).json({ message: 'Erro no servidor', error: err.message });
    }
};

exports.verifyCode = async (req, res) => {
    const { codigo } = req.body;
    const tempToken = req.cookies.tempToken;

    if (!codigo || !tempToken) {
        return res.status(400).json({ message: "Código é obrigatório ou Token expirado/inválido." });
    }

    try {
        const decoded = jwt.verify(tempToken, SECRET_KEY);
        const email = decoded.email;

        const verificationResult = await verifyVerificationCode(email, codigo); 
        if (verificationResult.success === false) {
            return res.status(400).json({ message: verificationResult.message });
        }
        console.log("🟡 Resultado da verificação:", verificationResult);
        await deleteVerificationCode(email);

        const authToken = jwt.sign({ email }, process.env.TOKEN_SECRET, { expiresIn: "30d" });
        res.cookie("token", authToken, { httpOnly: true, secure: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
        res.clearCookie("tempToken");
        res.redirect('dashboard')
    } catch (error) {
        console.error("Erro na confirmação:", error);
        res.status(500).json({ message: "Erro interno no servidor."});
    }
};
