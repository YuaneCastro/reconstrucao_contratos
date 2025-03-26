const { buscarToken, adicionar_senha, deletarToken} = require('../db');

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

        const { encarregado_id, expiracao } = tokenData;

        if (new Date() > expiracao) {
            return res.status(400).send('Token expirado.');
        }

        await atualizarSenha(encarregado_id, senha);
        await excluirToken(token);

        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao definir senha.');
    }
};