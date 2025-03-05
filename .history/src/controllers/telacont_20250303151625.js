const pool = require('../db'); // Importa a instância do pool de conexões

exports.showtelap = async(req, res) => {  // Ajuste no nome da função
   exports.showtelap = (req, res) => {
    res.render('dashboard', { nome: req.user.nome, email: req.user.email });
};

};
