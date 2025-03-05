const { findUserByEmail, createCode, deleteCode, findCode } = require('../db');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'sua_chave_secreta';

exports.showLoginPage = (req, res) => {
    res.render('login');
};

exports.showVerifyCode = (req, res) => {
    res.render('confirmlog');
};

exports.handleLogin = async (req, res) => {
    const { email, senha } = req.body;
    
    try {
        const user = await findUserByEmail(email);
        if (!user) return res.status(401).json({ message: 'Usuário não encontrado' });

        const isPasswordValid = bcrypt.compareSync(senha, user.senha_hash);
        if (!isPasswordValid) return res.status(401).json({ message: 'Email ou senha incorretos' });

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        await createCode(email, verificationCode);

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
            subject: 'Confirmação de login',
            text: `Seu código de confirmação é: ${verificationCode}. Ele expira em 5 minutos.`,
        });

        req.session.email = email; // Armazenar o email na sessão
        res.redirect('/confirmlogin'); // Redirecionar para a página de confirmação
    } catch (err) {
        console.error('Erro no login:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

async function verifyOTP() {
    const code = document.getElementById('otpInput').value;
    const button = document.querySelector('button'); // Seleciona o botão de confirmação

    // Desabilita o botão
    button.disabled = true;
    button.textContent = 'Verificando...'; // Altera o texto do botão para feedback visual

    try {
        const response = await fetch('/confirmlogin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email: "email_do_usuario", // Substitua pelo email do usuário
                codigo: code 
            })
        });

        const result = await response.json();

        if (response.ok) {
            console.log("Código validado! Redirecionando...");
            window.location.href = "/telap"; // Redireciona para a próxima tela
        } else {
            console.error("Código inválido:", result.message);
            alert(result.message || "Código inválido.");
        }
    } catch (error) {
        console.error("Erro na verificação do código:", error);
        alert("Erro ao confirmar código. Tente novamente.");
    } finally {
        // Reabilita o botão em caso de erro
        button.disabled = false;
        button.textContent = 'Confirmar'; // Restaura o texto original do botão
    }
}