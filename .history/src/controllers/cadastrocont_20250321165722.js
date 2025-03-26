const {estudanteExiste, criarEncarregado, gerarTokenRedefinicao } = require('../db');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const pendingUsers = new Map(); // Mapa para armazenar usuários pendentes

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

        // Cadastra o estudante
        await pool.query(
            'INSERT INTO estudantes (nome, data_nascimento, classe, turma, curso, encarregado_id) VALUES ($1, $2, $3, $4, $5, $6)',
            [ nome, data_nascimento, classe, turma, curso, encarregadoId]
        );

        await cadastrarEstudanteNoBanco(nome, data_nascimento, classe, turma, curso, encarregadoId);
        res.status(201).send('Estudante cadastrado e e-mail enviado ao encarregado.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao cadastrar estudante.');
    }
};

exports.pendingUsers = pendingUsers