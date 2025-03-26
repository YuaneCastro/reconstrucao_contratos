const { checkIfEmailExists, checkIfUsernameExists } = require('../db');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const pendingUsers = new Map(); // Mapa para armazenar usuários pendentes

exports.telacadastro = (req, res) => {
    res.render('cadastro');
};

exports.cadastrar = async (req, res) => {
    const { nome, data_nascimento, classe, turma, curso, encarregado_nome, encarregado_email, telefone } = req.body;

    try {
        if (await checkIfUsernameExists(nome)) {
            return res.status(400).send('este estudante ja foii cadastrado.');
        }

        
        res.redirect('/confirmcad');
    } catch (err) {
        console.error('Erro ao cadastrar usuário:', err);
        res.status(500).send('Erro ao processar o cadastro');
    }
};

exports.pendingUsers = pendingUsers