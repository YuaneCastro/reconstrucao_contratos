const { findUserByEmail, createCode, deleteCode, findCode } = require('../db');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'sua_chave_secreta';
const TOKEN_EXPIRATION = '30d'; 

// Página de login
exports.showLoginPage = (req, res) => {
    res.render('login');
};

// Página de confirmação do código
exports.showVerifyCode = (req, res) => {
    res.render('confirmlog');
};

// Manipulação do login
exports.handleLogin = async (req, res) => {
    const { email, senha } = req.body;
    
    try {
        const user = await findUserByEmail(email);
        if (!user) return res.status(401).json({ message: 'Usuário não encontrado' });

        const isPasswordValid = bcrypt.compareSync(senha, user.senha_hash);
        if (!isPasswordValid) return res.status(401).json({ message: 'Email ou senha incorretos' });

        // Gerar código de verificação
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        await createCode(email, verificationCode); // Salva código criptografado com timestamp

        // Enviar e-mail com código de verificação
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

        // Guardar email na sessão temporariamente
        req.session.email = email;
        res.redirect('/confirmlogin'); // Redirecionar para página de verificação
    } catch (err) {
        console.error('Erro no login:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

// Verificar código de verificação
exports.verifyCode = async (req, res) => {
    const { email, codigo } = req.body;

    if (!email || !codigo) {
        return res.status(400).json({ message: "Email e código são obrigatórios." });
    }

    try {
        const isValid = await findCode(email, codigo);
        if (!isValid) {
            return res.status(400).json({ message: "Código inválido ou expirado." });
        }

        // Criar token JWT
        const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });

        // Definir cookie seguro
        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: true,
            maxAge: 3600000 // 1 hora
        });

        // Remover o código do banco após validação
        await deleteCode(email);

        res.json({ message: "Código validado com sucesso!", token });

    } catch (error) {
        console.error("Erro na confirmação:", error);
        res.status(500).json({ message: "Erro interno no servidor." });
    }
};
