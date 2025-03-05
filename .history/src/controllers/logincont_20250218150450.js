const { findUserByEmail, createOTP, findOTPByUserId, deleteOTP } = require('../db');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken'); // Biblioteca para gerar o token
const SECRET_KEY = 'sua_chave_secreta';

exports.showLoginPage = (req, res) => {
    res.render('login');
};

exports.showVerifyCode = (req, res) => {
    res.render('confirmlog');
};

exports.handleLogin = async (req, res) => {
    const { email, senha } = req.body;
    console.log("Tentando login com email:", email);

    try {
        // Encontrar o usuário pelo email
        const user = await findUserByEmail(email);
        if (!user) {
            console.log("Usuário não encontrado");
            return res.status(401).json({ message: 'Usuário não encontrado' });
        }

        if (!user.senha_hash) {
            console.log("Senha não encontrada no banco para este usuário");
            return res.status(500).json({ message: 'Senha não encontrada para este usuário' });
        }

        // Comparar senha
        const isPasswordValid = bcrypt.compareSync(senha, user.senha_hash);
        if (!isPasswordValid) {
            console.log("Senha incorreta");
            return res.status(401).json({ message: 'Email ou senha incorretos' });
        }

        // Criar código OTP e tempo de expiração (5 minutos)
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expirationTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos

        // Enviar e-mail com OTP
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
            text: `Seu código de confirmação é: ${code}. Ele expira em 5 minutos.`,
        });

        console.log('E-mail enviado com sucesso:', email);

        // Salvar OTP no banco
        await createOTP(user.id, code, expirationTime);

        req.session.email = email;
        req.session.confirmationCode = code;

        // Redirecionar para a página de confirmação com os dados necessários
        res.redirect(`/confirmlogin`);
    } catch (err) {
        console.error('Erro ao fazer login:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};


exports.verifyCode = async (req, res) => {
    console.log("Recebendo requisição de confirmação:", req.body);
    
    const { code } = req.body;
    const userId = req.session.tempUserId; // Usando a variável da sessão para obter o ID do usuário

    // Log da sessão para depuração
    console.log("Sessão antes da confirmação:", req.session);

    // Verifica se o ID do usuário existe na sessão, se não, a sessão expirou
    if (!userId) {
        console.log("Sessão expirada ou não definida.");
        return res.status(401).json({ message: 'Sessão expirada. Faça login novamente.' });
    }

    console.log("Verificando código para usuário:", userId);

    try {
        // Buscar o OTP (código de confirmação) associado ao usuário no banco de dados
        const otpEntry = await findOTPByUserId(userId);

        // Se o código não for encontrado ou for inválido, retorna erro
        if (!otpEntry || otpEntry.code !== code) {
            console.log("Código inválido:", code);
            return res.status(401).json({ message: 'Código inválido ou expirado.' });
        }

        console.log("Código correto! Deletando OTP e gerando token...");

        // Remover o OTP após a validação bem-sucedida
        await deleteOTP(userId);

        // Criar um token JWT com o ID do usuário, sem expiração para a sessão
        const token = jwt.sign({ userId }, SECRET_KEY, { expiresIn: '24h' }); // O token terá validade de 24 horas

        // Armazenar o token no cookie, de forma segura e sem expiração rápida
        res.cookie('ctoken', token, { httpOnly: true, secure: true, maxAge: 24 * 60 * 60 * 1000 }); // Expira após 24 horas

        console.log("Redirecionando para dashboard...");

        // Retornar sucesso e redirecionamento para outra página
        res.json({ success: true, redirect: "/telap" });

    } catch (error) {
        // Se houver algum erro, exibe a mensagem de erro
        console.error("Erro na confirmação:", error);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
};


