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
    
};