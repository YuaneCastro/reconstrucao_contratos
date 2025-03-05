const { findOTPByUserId, deleteOTP, createOTP } = require('../db');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken'); // Biblioteca para gerar o token
const secretKey = 'sua_chave_secreta';

exports.showpageconflogin = (req, res) => {
    res.render('confirmlog');
};

exports.confirmCodelogin = async (req, res) =>{
    const { code } = req.body;
    const userId = req.session.tempUserId;

    if (!userId) {
        return res.status(401).json({ message: 'Sessão expirada. Faça login novamente.' });
    }

    try {
        // 🔹 Buscar OTP no banco de dados
        const otpData = await findOTPByUserId(userId);

        if (!otpData) {
            return res.status(400).json({ message: 'Código inválido ou expirado.' });
        }

        const { otp_code, expires_at } = otpData;

        // 🔹 Verificar expiração
        if (new Date() > new Date(expires_at)) {
            await deleteOTP(userId);
            return res.status(400).json({ message: 'Código expirado. Solicite um novo.' });
        }

        // 🔹 Verificar se o código inserido está correto
        if (code !== otp_code) {
            return res.status(400).json({ message: 'Código incorreto.' });
        }

        // 🔹 Código válido! Excluir OTP após o uso
        await deleteOTP(userId);

        // 🔹 Liberar o usuário para a área logada
        req.session.userId = userId;
        delete req.session.tempUserId; // Remover a chave temporária

        res.redirect('/telap');

    } catch (err) {
        console.error('Erro na verificação do código:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};