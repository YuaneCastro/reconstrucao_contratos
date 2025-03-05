const pool = require('../db'); // Importa a instância do pool de conexões

exports.showtelap = (req, res) => {
    res.render('dashboard', { nome: req.user.nome, email: req.user.email });
};

