const bcrypt = require('bcrypt');
const pool = require('../db');

const pendingUsers = new Map(); 

exports.showConfirmationPage = (req, res) => {
    res.render('confirm');
};

exports.handleConfirmation = async (req, res) => {
    const { email, confirmationCode } = req.body;

    try {
        // Verifica se o email está nos usuários pendentes
        if (!pendingUsers.has(email)) {
            return res.status(400).send('Código inválido ou expirado.');
        }

        const userData = pendingUsers.get(email);

        // Verifica se o código de confirmação está correto
        if (userData.confirmationCode !== confirmationCode) {
            return res.status(400).send('Código de confirmação incorreto.');
        }

        // Criptografando a senha
        const hashedPassword = await bcrypt.hash(userData.senha, 10);

        // Salvando o usuário no banco de dados
        await pool.query(
            'INSERT INTO usuarios (nome, email, senha_hash) VALUES ($1, $2, $3)',
            [userData.nome, email, hashedPassword]
        );

        // Removendo o usuário dos pendentes
        pendingUsers.delete(email);

        res.redirect('/auth/login'); // Redireciona para a página de login
    } catch (error) {
        console.error('Erro ao confirmar cadastro:', error);
        res.status(500).send('Erro ao confirmar cadastro.');
    }
};


exports.resendConfirmationCode = async (req, res) => {
    const email = req.session.pendingEmail;

    if (!email || !pendingUsers.has(email)) {
        return res.status(400).send('Usuário não encontrado. Registre-se novamente.');
    }

    const userData = pendingUsers.get(email);
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    userData.confirmationCode = newCode;
    userData.expiration = Date.now() + 60 * 1000; // Reinicia o tempo

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
            text: `Seu novo código de confirmação é: ${newCode}. Ele expira em 1 minuto.`,
        });

        res.status(200).send('Código reenviado.');
    } catch (err) {
        console.error('Erro ao reenviar código:', err);
        res.status(500).send('Erro ao reenviar código.');
    }
};