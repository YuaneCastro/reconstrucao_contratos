const { checkIfEmailExists, checkIfUsernameExists } = require('../db');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const pendingUsers = new Map(); // Mapa para armazenar usuários pendentes
const crypto = require('crypto');

exports.showRegisterPage = (req, res) => {
    res.render('cadastro');
};

exports.handleRegister = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        if (!nome || !email || !senha) {
            return res.status(400).send('Todos os campos são obrigatórios.');
        }

        if (await checkIfUsernameExists(nome)) {
            return res.status(400).send('O nome de usuário já está em uso.');
        }
        if (await checkIfEmailExists(email)) {
            return res.status(400).send('Email já está em uso.');
        }

        const confirmationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const hash = await bcrypt.hash(senha, 10);

        pendingUsers.set(email, {
            nome,
            senha: hash,
            confirmationCode,
        });

        const resultado = await bcrypt.compare(senha, );
        console.log("A senha corresponde ao hash?", resultado); 
        console.log(senha.hash);
        req.session.pendingEmail = email;

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