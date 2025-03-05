const { findOTPByUserId, deleteOTP, createOTP } = require('../db');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken'); // Biblioteca para gerar o token
const secretKey = 'sua_chave_secreta';

exports.showpageconflogin = (req, res) => {
    res.render('confirmlog');
};

exports.confirmCodelogin = (req, res) =>{
    const { code } = req.body;  
    const userId = req.session.tempUserId;
    
    if (!userId) {
        return res.status(401).json({ message: 'Sessão expirada. Faça login novamente.' });
    }
    try {
        // 🔹 Gerar novo código
        const newCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expirationTime = new Date();
        expirationTime.setMinutes(expirationTime.getMinutes() + 10);

        // 🔹 Atualizar código no banco
        await deleteOTP(userId);
        await createOTP(userId, newCode, expirationTime);

        // 🔹 Obter email do usuário
        const user = await findUserByEmail(userId);
        if (!user) {
            return res.status(400).json({ message: 'Usuário não encontrado.' });
        }
};