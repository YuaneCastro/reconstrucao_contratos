const { checkIfEmailExists, checkIfUsernameExists } = require('../db');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const pendingUsers = new Map(); // Mapa para armazenar usuários pendentes

exports.telacadastro = (req, res) => {
    res.render('cadastro');
};

exports.handleRegister = async (req, res) => {
    const { nome, data_nascimento, classe, turma, curso, encarregado_nome, encarregado_email, telefone } = req.body;

    try {
        // Verifica se o encarregado já existe
        let encarregado = await pool.query('SELECT * FROM encarregados WHERE email = $1', [encarregado_email]);

        let encarregadoId;
        if (encarregado.rows.length > 0) {
            encarregadoId = encarregado.rows[0].id;
        } else {
            // Cria o encarregado sem senha
            const result = await pool.query(
                'INSERT INTO encarregados (nome, email, telefone) VALUES ($1, $2, $3) RETURNING id',
                [encarregado_nome, encarregado_email, telefone]
            );
            encarregadoId = result.rows[0].id;
        }

        // Cadastra o estudante
        await pool.query(
            'INSERT INTO estudantes (nome, data_nascimento, classe, turma, curso, encarregado_id) VALUES ($1, $2, $3, $4, $5, $6)',
            [ nome, data_nascimento, classe, turma, curso, encarregadoId]
        );

        // Gera um token único para definir senha
        const token = crypto.randomBytes(32).toString('hex');
        const expiracao = new Date(Date.now() + 60 * 60 * 1000); // Expira em 1 hora

        await pool.query(
            'INSERT INTO tokens_redefinicao (encarregado_id, token, expiracao) VALUES ($1, $2, $3)',
            [encarregadoId, token, expiracao]
        );

        // Envia o e-mail para o encarregado
        const resetLink = `http://localhost:3000/set-password/${token}`;
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: encarregado_email,
            subject: 'Defina sua senha para acessar o sistema',
            html: `<p>Olá ${encarregado_nome},</p>
                   <p>Você precisa definir sua senha para acessar o sistema.</p>
                   <p><a href="${resetLink}">Clique aqui para definir sua senha</a></p>`
        });

        res.status(201).send('Estudante cadastrado e e-mail enviado ao encarregado.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao cadastrar estudante.');
    }
};

exports.pendingUsers = pendingUsers