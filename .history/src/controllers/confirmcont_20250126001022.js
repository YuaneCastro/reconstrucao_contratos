const pool = require('../db');
const nodemailer = require('nodemailer');
const pendingUsers = require('./cadastrocont').pendingUsers;

exports.showConfirmationPage = (req, res) => {
    res.render('confirm');
};

exports.resendConfirmationCode = async (req, res) => {
    const email = req.session.pendingEmail;

    if (!email || !pendingUsers.has(email)) {
        return res.status(400).send('Usuário não encontrado. Registre-se novamente.');
    }

    const userData = pendingUsers.get(email);
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    userData.confirmationCode = newCode;
    userData.expiration = Date.now() + 40 * 1000;

    try {
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
            subject: 'Reenvio de Código de Confirmação',
            text: `Seu novo código de confirmação é: ${newCode}. Ele expira em 40 segundos.`,
        });

        console.log('Código reenviado com sucesso para:', email);
        res.status(200).send('Código reenviado. Verifique seu e-mail.');
    } catch (err) {
        console.error('Erro ao reenviar código:', err);
        res.status(500).send('Erro ao reenviar código.');
    }
};

exports.handleConfirmation = async (req, res) => {
    const {confirmationCode } = req.body;
    const email = req.session.pendingEmail;

    
    if (!email || !pendingUsers.has(email)) {
        console.error(`Usuário não encontrado na sessão ou pendentes: ${email}`);
        return res.status(404).send('Usuário não encontrado ou já confirmado.');
    }

    const userData = pendingUsers.get(email);

    if (userData.confirmationCode !== confirmationCode) {
        console.error(`Código inválido para o e-mail: ${email}`);
        return res.status(400).send('Código de confirmação inválido.');
    }

    try {
        await addUserToDB(userData.nome, email, userData.senha);
        pendingUsers.delete(email);
        console.log(`Usuário confirmado: ${email}`);
        res.status(200).send('Cadastro confirmado com sucesso!');
        res.redirect('')
    } catch (err) {
        console.error('Erro ao adicionar usuário ao banco:', err);
        res.status(500).send('Erro ao confirmar cadastro.');
    }
};

