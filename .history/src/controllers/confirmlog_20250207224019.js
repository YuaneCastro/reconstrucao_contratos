const { findOTPByUserId, deleteOTP, createOTP } = require('../db');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken'); // Biblioteca para gerar o token
const secretKey = 'sua_chave_secreta';

exports.showpageconflogin = (req, res) => {
    res.render('confirmlog');
};

exports.confirmCodelogin = async (req, res) =>{
    const { code } = req.body;
    const userId = req.session.tempUserId;

    if (!userId) {
        return res.status(401).json({ message: 'Sessão expirada. Faça login novamente.' });
    }

    try {
        // 🔹 Buscar OTP no banco de dados
        const otpData = await findOTPByUserId(userId);

        if (!otpData) {
            return res.status(400).json({ message: 'Código inválido ou expirado.' });
        }

        const { otp_code, expires_at } = otpData;

        // 🔹 Verificar expiração
        if (new Date() > new Date(expires_at)) {
            await deleteOTP(userId);
            return res.status(400).json({ message: 'Código expirado. Solicite um novo.' });
        }

        // 🔹 Verificar se o código inserido está correto
        if (code !== otp_code) {
            return res.status(400).json({ message: 'Código incorreto.' });
        }

        // 🔹 Código válido! Excluir OTP após o uso
        await deleteOTP(userId);

        // 🔹 Liberar o usuário para a área logada
        req.session.userId = userId;
        delete req.session.tempUserId; // Remover a chave temporária

        return res.status(200).json({ 
            message: 'Código verificado com sucesso!', 
            redirectUrl: '/dashboard' // Página para onde o usuário será redirecionado
        });

    } catch (err) {
        console.error('Erro na verificação do código:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

exports.resendOTP = async (req, res) => {
    const userId = req.session.tempUserId;

    if (!userId) {
        return res.status(401).json({ message: 'Sessão expirada. Faça login novamente.' });
    }

    try {
        // 🔹 Gerar novo código
        const newCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expirationTime = new Date();
        expirationTime.setMinutes(expirationTime.getMinutes() + 10);

        // 🔹 Atualizar código no banco
        await deleteOTP(userId);
        await createOTP(userId, newCode, expirationTime);

        // 🔹 Obter email do usuário
        const user = await findUserByEmail(userId);
        if (!user) {
            return res.status(400).json({ message: 'Usuário não encontrado.' });
        }

        // 🔹 Enviar email com novo código
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Novo código de confirmação',
            text: `Seu novo código de confirmação é: ${newCode}`,
        });

        console.log('📧 Novo código enviado para:', user.email);
        return res.status(200).json({ message: 'Novo código enviado para seu email.' });

    } catch (err) {
        console.error('Erro ao reenviar código:', err);
        res.status(500).json({ message: 'Erro ao gerar novo código' });
    }
};