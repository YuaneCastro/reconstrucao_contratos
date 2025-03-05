const bcrypt = require('bcrypt');
const pool = require('../db');
const nodemailer = require('nodemailer');
const pendingUsers = require('./cadastrocont').pendingUsers;

exports.showConfirmationPage = (req, res) => {
    res.render('confirm');
};

exports.handleConfirmation = async (req, res) => {
    const { email, confirmationCode } = req.body;

    try {
        if (!pendingUsers.has(email)) {
            console.error('Usuário não encontrado:', email);
            return res.status(400).send('Código inválido ou expirado.');
        }

        const userData = pendingUsers.get(email);

        if (Date.now() > userData.expiration) {
            console.error('Código expirado para o usuário:', email);
            pendingUsers.delete(email);
            return res.status(400).send('O código expirou. Solicite um novo código.');
        }

        if (userData.confirmationCode !== confirmationCode) {
            console.error('Código incorreto para o usuário:', email);
            return res.status(400).send('Código de confirmação incorreto.');
        }

        const hashedPassword = await bcrypt.hash(userData.senha, 10);

        await pool.query(
            'INSERT INTO usuarios (nome, email, senha_hash) VALUES ($1, $2, $3)',
            [userData.nome, email, hashedPassword]
        );

        pendingUsers.delete(email);
        console.log('Usuário cadastrado com sucesso:', email);
        res.status(200).send('Cadastro confirmado com sucesso! Faça login para continuar.');
    } catch (error) {
        console.error('Erro ao confirmar cadastro:', error);
        res.status(500).send('Erro ao confirmar cadastro.');
    }
};

