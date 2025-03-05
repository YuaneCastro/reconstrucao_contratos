// controllers/authcont.js
const nodemailer = require('nodemailer');
const crypto = require('crypto');  // Para gerar um código único de confirmação
const User = require('../models/user');  // Modelo de usuário, adaptado ao seu banco de dados

// Função de registro
exports.registerUser = async (req, res) => {
    const { email, password } = req.body;

    // Crie um usuário no banco de dados (valide os dados antes)
    const newUser = new User({
        email,
        password,  // Aqui você deve criptografar a senha
    });
    
    try {
        await newUser.save();

        // Gerar código de confirmação
        const confirmationCode = crypto.randomBytes(20).toString('hex');
        
        // Armazenar o código no banco de dados para futura validação (ex: em um campo de 'confirmationCode')
        newUser.confirmationCode = confirmationCode;
        await newUser.save();

        // Enviar o código de confirmação por email
        const transporter = nodemailer.createTransport({
            service: 'gmail',  // Exemplo usando o Gmail, configure conforme necessário
            auth: {
                user: 'seu-email@gmail.com',
                pass: 'sua-senha'
            }
        });

        const mailOptions = {
            from: 'seu-email@gmail.com',
            to: email,
            subject: 'Confirme seu cadastro',
            text: `Seu código de confirmação é: ${confirmationCode}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).send('Erro ao enviar email de confirmação.');
            }
            console.log('Email enviado: ' + info.response);
            res.redirect('/confirm');  // Redireciona para a tela de confirmação
        });
    } catch (err) {
        res.status(500).send('Erro ao registrar o usuário.');
    }
};
