const { findOTPByUserId, deleteOTP, createOTP } = require('../db');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken'); // Biblioteca para gerar o token
const SECRET_KEY = 'sua_chave_secreta';

exports.showpageconflogin = (req, res) => {
    res.render('confirmlog');
};

exports.confirmCodelogin = async (req, res) =>{
    const { code } = req.body;
    const email = req.session.email; // Recuperar o e-mail salvo na sessão

    if (!email) {
        return res.status(401).json({ message: 'Sessão expirada. Faça login novamente.' });
    }

    try {
        // Buscar o usuário pelo e-mail
        const user = await findUserByEmail(email);
        if (!user) return res.status(401).json({ message: 'Usuário não encontrado' });

        // Verificar se o código OTP é válido
        const otpRecord = await findOTPByUserId(user.id);
        if (!otpRecord || otpRecord.code !== code) {
            return res.status(400).json({ message: 'Código inválido ou expirado' });
        }

        // Remover OTP do banco
        await deleteOTP(user.id);

        // Gerar Token JWT
        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

        // Armazenar o token em um cookie seguro
        res.cookie('auth_token', token, { httpOnly: true, secure: true, maxAge: 3600000 });

        console.log('Login confirmado, redirecionando para o dashboard');
        res.redirect('/telap');
    } catch (err) {
        console.error('Erro ao confirmar código:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};