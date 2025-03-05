const {findUserByEmail, createOTP} = require('../db');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

exports.showLoginPage = (req, res) => {
    res.render('login');
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

        // Criar código OTP e tempo de expiração (5 minutos)
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expirationTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos

        // Enviar e-mail com OTP
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

        console.log('E-mail enviado com sucesso:', email);

        // Salvar OTP no banco
        await createOTP(user.id, code, expirationTime);

        req.session.email = email;
        return res.status(200).json({ 
            redirectUrl: '/confirmlog' 
        });
    } catch (err) {
        console.error('Erro ao fazer login:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};