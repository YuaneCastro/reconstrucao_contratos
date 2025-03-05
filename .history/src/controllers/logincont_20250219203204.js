const { findUserByEmail, createCode, deleteCode, findCode } = require('../db');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'sua_chave_secreta';
const TOKEN_EXPIRATION = '30d'; 

// Página de login
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

        // Gerar código de verificação aleatório
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedCode = await bcrypt.hash(verificationCode, 10); // Criptografar o código

        // Armazena o código criptografado no banco
        await createCode(email, hashedCode);

        // Configurar serviço de email (Gmail)
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

        // Armazena email na sessão para recuperar depois
        req.session.email = email;
        res.redirect('/confirmlogin');
    } catch (err) {
        console.error('Erro no login:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

exports.verifyCode = async (req, res) => {
    console.log("Corpo da requisição:", req.body);

    const { email, codigo } = req.body;

    if (!email || !codigo) {
        return res.status(400).json({ message: "Email e código são obrigatórios." });
    }

    try {
        const isValid = await findCode(email, codigo);
        if (!isValid) {
            return res.status(400).json({ message: "Código inválido ou expirado." });
        }

        // 🔑 Criar token JWT válido por muito tempo (ex: 30 dias)
        const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '30d' });

        // 🍪 Definir cookies duradouros
        res.cookie("token", token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 }); // 30 dias

        console.log(`Usuário ${email} autenticado com sucesso!`);

        // ✅ Redireciona para a Dashboard (telap)
        res.json({ success: true, redirect: "/telap" });

    } catch (error) {
        console.error("Erro na confirmação:", error);
        res.status(500).json({ message: "Erro interno no servidor." });
    }
};


