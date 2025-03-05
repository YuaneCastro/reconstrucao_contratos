const { findUserByEmail, createOTP, validateOTP } = require('../db');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

exports.showLoginPage = (req, res) => {
    res.render('login');
};

exports.handleLogin = async (req, res) => {
    const { email, senha } = req.body;
    console.log("Tentando login com email:", email);

    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Usuário não encontrado' });
        }

        if (!user.senha_hash) {
            return res.status(500).json({ message: 'Senha não encontrada para este usuário' });
        }

        const isPasswordValid = bcrypt.compareSync(senha, user.senha_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Email ou senha incorretos' });
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expirationTime = new Date(Date.now() + 5 * 60 * 1000);

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
            text: `Seu código de confirmação é: ${code}. Ele expira em 5 minutos.`,
        });

        await createOTP(user.id, code, expirationTime);

        res.json({ message: 'Código enviado para seu e-mail!' });
    } catch (err) {
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

exports.confirmCode = async (req, res) => {
    const { code } = req.body;
    try {
        const user = await validateOTP(code);
        if (!user) {
            return res.status(401).json({ message: 'Código inválido ou expirado' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Código confirmado', token });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao validar código' });
    }
};
