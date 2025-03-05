const { checkIfEmailExists, checkIfUsernameExists } = require('../db');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const pendingUsers = new Map(); // Mapa para armazenar usuários pendentes

exports.showRegisterPage = (req, res) => {
    res.render('cadastro');
};

exports.handleRegister = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        if (!nome || !email || !senha) {
            return res.status(400).send('Todos os campos são obrigatórios.');
        }

        // Verificar se o usuário já está registrado ou nos pendentes
        if (await checkIfUsernameExists(nome)) {
            return res.status(400).send('O nome de usuário já está em uso.');
        }
        if (await checkIfEmailExists(email)) {
            return res.status(400).send('Email já está em uso.');
        }

        // Gerar código de confirmação e salvar nos pendentes
        const confirmationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedPassword = await bcrypt.hash(senha, 10);

        pendingUsers.set(email, {
            nome,
            senha: hashedPassword,
            confirmationCode,
        });

        // Salvar e-mail na sessão
        req.session.pendingEmail = email;

        // Enviar e-mail
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
            subject: 'Confirmação de Cadastro',
            text: `Seu código de confirmação é: ${confirmationCode}`,
        });

        console.log('E-mail enviado com sucesso:', email);
        res.redirect('/confirmcad');
    } catch (err) {
        console.error('Erro ao cadastrar usuário:', err);
        res.status(500).send('Erro ao processar o cadastro');
    }
};

exports.pendingUsers = pendingUsers;