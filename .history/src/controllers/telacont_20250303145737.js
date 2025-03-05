const pool = require('../db'); // Importa a instância do pool de conexões
const nodemailer = require('nodemailer');

exports.showtelap = (req, res) => {  // Ajuste no nome da função
    try {
        const { email } = req.user; // Obtém o email do usuário autenticado
        const result = await pool.query('SELECT nome, email, data_criacao FROM usuarios WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(404).send("Usuário não encontrado.");
        }

        const user = result.rows[0];

        res.render('dashboard', { 
            nome: user.nome, 
            email: user.email,
            dataCriacao: user.data_criacao
        });

    } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        res.status(500).send("Erro no servidor.");
    }
};
