const pool = require('../db'); // Importa a instância do pool de conexões
const nodemailer = require('nodemailer');

exports.showtelap = (req, res) => {  // Ajuste no nome da função
    res.render('dashboard', { email: req.user.email });
};
