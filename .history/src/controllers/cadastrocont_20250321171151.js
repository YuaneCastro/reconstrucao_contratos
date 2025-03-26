const {estudanteExiste, buscarEncarregadoPorEmail, criarEncarregado, gerarTokenRedefinicao, enviarEmailRedefinicao, cadastrarEstudanteNoBanco } = require('../db');

exports.telacadastro = (req, res) => {
    res.render('cadastro');
};

exports.cadastrar = async (req, res) => {
    const { nome, data_nascimento, classe, turma, curso, encarregado_nome, encarregado_email, telefone } = req.body;

    try {
        if (await estudanteExiste(nome)) {
            return res.status(400).send('este estudante ja foi cadastrado.');
        }

        let encarregado = await buscarEncarregadoPorEmail(encarregado_email);
        let encarregadoId;

         if (encarregado) {
            encarregadoId = encarregado.id;
        } else {
            // Cria o encarregado e gera um token de redefinição de senha
            encarregadoId = await criarEncarregado(encarregado_nome, encarregado_email, telefone);
            const token = await gerarTokenRedefinicao(encarregadoId);
            await enviarEmailRedefinicao(encarregado_email, encarregado_nome, token);
        }
        await cadastrarEstudanteNoBanco(nome, data_nascimento, classe, turma, curso, encarregadoId);
        res.status(201).send('Estudante cadastrado e e-mail enviado ao encarregado.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao cadastrar estudante.');
    }
};

module.exports = cadastrarEstudante;