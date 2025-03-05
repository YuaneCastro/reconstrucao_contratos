const { findUserByEmail, createCode, deleteCode, findCode } = require('../db');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'sua_chave_secreta';

exports.showLoginPage = (req, res) => {
    res.render('login');
};

exports.showVerifyCode = (req, res) => {
    res.render('confirmlog');
};

exports.handleLogin = async (req, res) => {
    const { email, senha } = req.body;
    
    try {
        const user = await findUserByEmail(email);
        if (!user) return res.status(401).json({ message: 'Usuário não encontrado' });

        const isPasswordValid = bcrypt.compareSync(senha, user.senha_hash);
        if (!isPasswordValid) return res.status(401).json({ message: 'Email ou senha incorretos' });

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        await createCode(email, verificationCode);

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
            text: `Seu código de confirmação é: ${verificationCode}. Ele expira em 5 minutos.`,
        });

        req.session.email = email;
        res.redirect('/confirmlogin') // ✅ Apenas esta resposta
    } catch (err) {
        console.error('Erro no login:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

exports.verifyCode = async (req, res) => {
    const { code } = req.body;
    const email = req.session.email;

    if (!email) return res.status(401).json({ message: "Acesso negado. Faça login novamente." });

    try {
        const isValidCode = await findCode(email, code);
        if (!isValidCode) return res.status(401).json({ message: "Código inválido ou expirado." });

        const user = await findUserByEmail(email);
        if (!user) return res.status(401).json({ message: "Usuário não encontrado" });

        await deleteCode(email);

        const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "24h" });
        res.cookie("ctoken", token, { httpOnly: true, secure: true, maxAge: 24 * 60 * 60 * 1000 });

        res.json({ success: true, redirect: "/telap" });
    } catch (error) {
        console.error("Erro na confirmação:", error);
        res.status(500).json({ message: "Erro no servidor." });
    }
};