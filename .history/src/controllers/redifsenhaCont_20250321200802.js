const bcrypt = require('bcrypt');
const { verifytokenn, adicionar_senha, deletartokenn} = require('../db');

exports.telapass = async (req, res) =>{
    res.render('setPassword');
};

exports.setPassword = async (req, res) => {
    const { token } = req.params;
    const { senha } = req.body;

    console.log("Token recebido:", token);
    try {
        const result = await pool.query('SELECT * FROM tokens_redefinicao WHERE token = $1', [token]);
        if (result.rows.length === 0) {
            return res.status(400).send('Token inválido ou expirado.');
        }

        const { encarregado_id, expiracao } = result.rows[0];

        if (new Date() > expiracao) {
            return res.status(400).send('Token expirado.');
        }

        const senhaHash = await bcrypt.hash(senha, 10);
        await pool.query('UPDATE encarregados SET senha_hash = $1 WHERE id = $2', [senhaHash, encarregado_id]);
        await pool.query('DELETE FROM tokens_redefinicao WHERE token = $1', [token]);

        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao definir senha.');
    }
};