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
            return res.status(400).send('O nome de usuário já está em uso.');
        }
        if (await checkIfEmailExists(email)) {
            return res.status(400).send('Email já está em uso.');
        }

        const confirmationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const hashcode = await bcrypt.hash(confirmationCode, 10);
        const hash = await bcrypt.hash(senha, 10);

        pendingUsers.set(email, {
            nome,
            senha: hash,
            hashcode,
        });

        const userD = pendingUsers.get(email);
        const resultado1 = await bcrypt.compare(senha, userD.senha);
        const resultado2 = await bcrypt.compare(confirmationCode, userD.hashcode)
        console.log("A senha corresponde ao hash?", resultado1); 
        console.log("A codigo corresponde ao hash?", resultado2); 
        console.log(userD.senha);
        req.session.pendingEmail = email;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Confirmação de Cadastro',
            text: `Seu código de confirmação é: ${confirmationCode}`,
        });

        console.log('E-mail enviado com sucesso:', email);
        res.redirect('/confirmcad');
    } catch (err) {
        console.error('Erro ao cadastrar usuário:', err);
        res.status(500).send('Erro ao processar o cadastro');
    }
};

exports.pendingUsers = pendingUsers