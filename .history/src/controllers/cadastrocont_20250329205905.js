const { buscarEncarregadoPorCampo, buscaridestudante,logEvent,buscarToken, adicionar_senha, deletarToken, estudanteExiste, criarEncarregado, gerarTokenRedefinicao, cadastrarEstudanteNoBanco } = require('../db');
const nodemailer = require('nodemailer');

exports.telacadastro = (req, res) => {
    res.render('cadastro/cadastro');
};
exports.telapass = async (req, res) =>{
    res.render('cadastro/setPassword');
};



exports.setPassword = async (req, res) => {
    const { token } = req.params;
    const { senha } = req.body;
    try {
        const tokenData = await buscarToken(token);
        if (!tokenData) {
            return res.status(400).send('Token inválido ou expirado.');
        }

        const { encarregado_id, expiracao } = tokenData;

        if (new Date() > expiracao) {
            return res.status(400).send('Token expirado.');
        }

        await adicionar_senha(encarregado_id, senha);
        await deletarToken(token);

        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao definir senha.');
    }
};

