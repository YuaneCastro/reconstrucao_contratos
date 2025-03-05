const pool = require('../db'); // Importa a instância do pool de conexões
const nodemailer = require('nodemailer');

exports.showtelap = (req, res)=>{
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.redirect('/');
    }
};