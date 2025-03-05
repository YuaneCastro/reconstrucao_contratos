const bcrypt = require('bcrypt');
const pool = require('../db');
const nodemailer = require('nodemailer');

const pendingUsers = new Map(); // Mapa de usuários pendentes

// Renderiza a página de confirmação
exports.showConfirmationPage = (req, res) => {
    res.render('confirm');
};

// Lida com a confirmação do código
exports.handleConfirmation = async (req, res) => {
    const { email, confirmationCode } = req.body;

    try {
        // Verifica se o email está nos usuários pendentes
        if (!pendingUsers.has(email)) {
            console.log('Usuário não encontrado:', email);
            return res.status(400).send('Código inválido ou expirado.');
        }

        const userData = pendingUsers.get(email);

        // Verifica se o código expirou
        if (Date.now() > userData.expiration) {
            console.log('Código expirado:', userData.expiration);
            pendingUsers.delete(email);
            return res.status(400).send('O código expirou. Solicite um novo código.');
        }

        // Verifica se o código de confirmação está correto
        if (userData.confirmationCode !== confirmationCode) {
            console.log('Código incorreto:', confirmationCode, 'esperado:', userData.confirmationCode);
            return res.status(400).send('Código de confirmação incorreto.');
        }

        // Criptografa a senha
        const hashedPassword = await bcrypt.hash(userData.senha, 10);

        // Salva o usuário no banco de dados
        await pool.query(
            'INSERT INTO usuarios (nome, email, senha_hash) VALUES ($1, $2, $3)',
            [userData.nome, email, hashedPassword]
        );

        // Remove o usuário do mapa de pendentes
        pendingUsers.delete(email);

        console.log('Usuário cadastrado com sucesso:', email);
        return res.status(200).send('Cadastro confirmado com sucesso! Faça login para continuar.');
    } catch (error) {
        console.error('Erro ao confirmar cadastro:', error);
        return res.status(500).send('Erro ao confirmar cadastro. Tente novamente mais tarde.');
    }
};

// Reenvia o código de confirmação
exports.resendConfirmationCode = async (req, res) => {
    console.log('Debug: Sessão no início de resendConfirmationCode:', req.session);
    const email = req.session.pendingEmail;

    if (!email) {
        console.log('Reenvio falhou. E-mail ausente ou indefinido na sessão.');
        return res.status(400).send('E-mail não encontrado na sessão. Registre-se novamente.');
    }


    
    if (!pendingUsers.has(email)) {
        console.log('Reenvio falhou. Usuário não encontrado:', email);
        return res.status(400).send('Usuário não encontrado. Registre-se novamente.');
    }

    const userData = pendingUsers.get(email);
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    userData.confirmationCode = newCode;
    userData.expiration = Date.now() + 40 * 1000;

    try {
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
            subject: 'Reenvio de Código de Confirmação',
            text: `Seu novo código de confirmação é: ${newCode}. Ele expira em 40 segundos.`,
        });

        console.log('Código reenviado para:', email);
        return res.status(200).send('Código reenviado. Verifique seu e-mail.');
    } catch (err) {
        console.error('Erro ao reenviar código:', err);
        return res.status(500).send('Erro ao reenviar código.');
    }
};
