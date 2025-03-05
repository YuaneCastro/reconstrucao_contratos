const { findUserByEmail, createCode, deleteCode, findCode } = require('../db');
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
    
    try {
        const user = await findUserByEmail(email);
        if (!user) return res.status(401).json({ message: 'Usuário não encontrado' });

        // Comparar senha com hash do banco
        const isPasswordValid = await bcrypt.compare(senha, user.senha_hash);
        if (!isPasswordValid) return res.status(401).json({ message: 'Email ou senha incorretos' });

        // Criar código de verificação
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        await createCode(email, verificationCode);

        // Configurar transporte de email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Enviar código de verificação por e-mail
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Confirmação de login',
            text: `Seu código de confirmação é: ${verificationCode}. Ele expira em 5 minutos.`,
        });

        // Armazenar email na sessão
        req.session.email = email;

        // Redirecionar para a página de confirmação do código
        res.json({ success: true });
    } catch (err) {
        console.error('Erro no login:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};
exports.verifyCode = async (req, res) => {
    const { codigo } = req.body;
    const email = req.session.email; // Recuperar o email da sessão

    if (!email || !codigo) {
        return res.status(400).json({ message: "Email e código são obrigatórios." });
    }

    try {
        const isValid = await findCode(email, codigo);
        if (!isValid) {
            return res.status(400).json({ message: "Código inválido ou expirado." });
        }

        // Gerar token JWT
        const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '30d' });

        // Configurar cookie
        res.cookie('token', token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });

        // Deletar o código após a confirmação
        await deleteCode(email);

        // Redirecionar para a página principal
        res.json({ message: "Código validado com sucesso!", token });
    } catch (error) {
        console.error("Erro na confirmação:", error);
        res.status(500).json({ message: "Erro interno no servidor." });
    }
};