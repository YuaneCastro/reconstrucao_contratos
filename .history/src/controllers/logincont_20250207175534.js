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
        // Verificar se o usuário existe
        if (!user) {
            console.log(" Usuário não encontrado");
            return res.status(401).json({ message: 'Usuário não encontrado' });
        }

        // Verificar se o campo senha_hash existe no usuário
        if (!user.senha_hash) {
              console.log(" Senha não encontrada no banco para este usuário");
            return res.status(500).json({ message: 'Senha não encontrada para este usuário' });
        }

        // Comparar a senha fornecida com o hash
        const isPasswordValid = await bcrypt.compare(senha, user.senha_hash);
        if (!isPasswordValid) {
            console.log(" Senha incorreta");
            return res.status(401).json({ message: 'Email ou senha incorretos' });
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString();
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
            text: `Seu código de confirmação é: ${code}`,
        });
        const expirationTime = new Date();
        expirationTime.setMinutes(expirationTime.getMinutes() + 10); // Expira em 10 min
        await createOTP(user.id, code, expirationTime);

        // 🔹 Armazenar apenas o ID do usuário na sessão
        req.session.tempUserId = user.id;
        return res.status(200).json({ 
            message: 'Login realizado com sucesso', 
            redirectUrl: '/confirmlog' // Retorna a URL de redirecionamento
        });
    } catch (emailError) {
        console.error('Erro ao enviar e-mail:', emailError);
        return res.status(500).json({ message: 'Erro ao enviar e-mail de confirmação' });
    }
};