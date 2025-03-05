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
        const otpData = await findOTPByUserId(userId);
        if (!otpData) {
            return res.status(400).json({ message: 'Código inválido ou expirado.' });
        }
};