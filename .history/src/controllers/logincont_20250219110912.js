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
    console.log("Tentando login com email:", email);

    try {
        // Encontrar o usuário pelo email
        const user = await findUserByEmail(email);
        if (!user) {
            console.log("Usuário não encontrado");
            return res.status(401).json({ message: 'Usuário não encontrado' });
        }

        if (!user.senha_hash) {
            console.log("Senha não encontrada no banco para este usuário");
            return res.status(500).json({ message: 'Senha não encontrada para este usuário' });
        }

        // Comparar senha
        const isPasswordValid = bcrypt.compareSync(senha, user.senha_hash);
        if (!isPasswordValid) {
            console.log("Senha incorreta");
            return res.status(401).json({ message: 'Email ou senha incorretos' });
        }

        // Criar código OTP de 6 dígitos
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); 
        await createCode(email, verificationCode); // Salvar código no banco

        // Configuração do transporte de e-mail
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Enviar e-mail com o código
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Confirmação de login',
            text: `Seu código de confirmação é: ${verificationCode}. Ele expira em 5 minutos.`,
        });

        console.log('E-mail enviado com sucesso:', email);

        // Armazena email na sessão para futura validação
        req.session.email = email;
        req.session.confirmationCode = verificationCode;
        console.log("Email salvo na sessão:", req.session.email);

        // Redirecionar para a página de confirmação
        res.redirect(`/confirmlogin`);
    } catch (err) {
        console.error('Erro ao fazer login:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

exports.verifyCode = async (req, res) => {
    const { code } = req.body;
    const email = req.session.email;

    if (!email) {
        console.log("Email não encontrado na sessão. Sessão atual:", req.session);
        return res.status(401).json({ message: "Acesso negado. Faça login novamente." });
    }

    try {
        // Buscar o código salvo no banco
        const isValidCode = await findCode(email, code);

        if (!isValidCode) {
            console.log("Código inválido ou expirado:", code);
            return res.status(401).json({ message: "Código inválido ou expirado." });
        }

        // Buscar o usuário pelo email
        const user = await findUserByEmail(email);
        if (!user) {
            console.log("Usuário não encontrado");
            return res.status(401).json({ message: "Usuário não encontrado" });
        }

        // Remover código após a verificação bem-sucedida
        await deleteCode(email);
        console.log("Código removido com sucesso para:", email);

        // Criar token JWT
        const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "24h" });
        res.cookie("ctoken", token, { httpOnly: true, secure: true, maxAge: 24 * 60 * 60 * 1000 });

        res.json({ success: true, redirect: "/telap" });
    } catch (error) {
        console.error("Erro na confirmação:", error);
        res.status(500).json({ message: "Erro no servidor." });
    }
};
