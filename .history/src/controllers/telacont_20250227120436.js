const pool = require('../db'); // Importa a instância do pool de conexões
const nodemailer = require('nodemailer');

exports.showtelap = (req, res)=>{
    res.render('dashboard', { email: req.user.email });
};