const bcrypt = require('bcrypt');
const { buscarToken, adicionar_senha, } = require('../db');

exports.telapass = async (req, res) =>{
    res.render('setPassword');
};

exports.setPassword = async (req, res) => {
    const { token } = req.params;
    const { senha } = req.body;

    console.log("Token recebido:", token);
    try {
        const tokenData = await buscarToken(token);
        if (!tokenData) {
            return res.status(400).send('Token inválido ou expirado.');
        }

        if (verificarExpiracao(tokenData.expiracao)) {
            return res.status(400).send('Token expirado.');
        }

        await adicionar_senha(tokenData.encarregado_id, senha);
        await deletarToken(token);

        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao definir senha.');
    }
};