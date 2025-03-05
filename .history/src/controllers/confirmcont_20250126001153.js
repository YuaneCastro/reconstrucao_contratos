const pool = require('../db');
const nodemailer = require('nodemailer');
const pendingUsers = require('./cadastrocont').pendingUsers;

exports.showConfirmationPage = (req, res) => {
    res.render('confirm');
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
        res.redirect('/telap')
    } catch (err) {
        console.error('Erro ao adicionar usuário ao banco:', err);
        res.status(500).send('Erro ao confirmar cadastro.');
    }
};

