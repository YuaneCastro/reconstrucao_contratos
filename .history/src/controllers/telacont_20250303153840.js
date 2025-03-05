const pool = require('../db');

exports.showtelap = async (req, res) => {
    try {
        const email = req.user.email;
        const result = await pool.query("SELECT nome, email, data_criacao FROM usuarios WHERE email = $1", [email]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        const user = result.rows[0];

        res.render("dashboard", { nome: user.nome, email: user.email, data_criacao: user.data_criacao });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro no servidor" });
    }
};

