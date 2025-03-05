const { findUserByEmail, deleteVerificationCode, saveVerificationCode, sendVerificationEmail, deleteCode, findCode } = require('../db');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'sua_chave_secreta';
const verificationCodes = new Map();


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
        console.log("Usuário encontrado:", user); 

        if (!user) {
            console.log("Usuário não encontrado");
            return res.status(401).json({ message: 'Usuário não encontrado' });
        }

        const isPasswordValid = bcrypt.compareSync(senha, user.senha_hash);
        console.log("Senha válida?", isPasswordValid); 

        if (!isPasswordValid) {
            console.log("Senha incorreta");
            return res.status(401).json({ message: 'Email ou senha incorretos' });
        }
        await deleteVerificationCode(user.id);
        const verificationCode = Math.floor(100000 + Math.random() * 900000); 
        verificationCodes.set(email, verificationCode);
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
        req.session.email = email; // Armazena o email temporariamente
        res.json({ success: true, message: "Login bem-sucedido!" });
    } catch (err) {
        console.error('Erro no login:', err); // 🔹 Adicionando log do erro real
        res.status(500).json({ message: 'Erro no servidor', error: err.message });
    }
};

exports.verifyCode = async (req, res) => {
    const { email, codigo } = req.body;
    const email = verificationCodes.get(email);

    if (!email || !codigo) {
        return res.status(400).json({ message: "Email e código são obrigatórios." });
    }

    try {
       

        if (!storedCode || storedCode.toString() !== codigo) {
            return res.status(400).json({ message: "Código inválido ou expirado." });
        }

        // Remove o código do Map após a verificação
        verificationCodes.delete(email);

        // Gerar token JWT
        const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '30d' });

        // Configurar cookie
        res.cookie('token', token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });

        res.json({ message: "Código validado com sucesso!", token });
    } catch (error) {
        console.error("Erro na confirmação:", error);
        res.status(500).json({ message: "Erro interno no servidor." });
    }
};
