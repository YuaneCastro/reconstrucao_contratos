const { findUserByEmail, deleteVerificationCode, saveVerificationCode, verifyVerificationCode} = require('../db');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;


exports.showLoginPage = (req, res) => {
    res.render('login');
};

exports.showVerifyCodePage = (req, res) => {
    res.render('confirmlog');
};

exports.handleLogin = async (req, res) => {
    const { email, senha } = req.body;
    console.log("Recebendo login:", email); 

    try {
        const user = await findUserByEmail(email);
        if (!user) {
            console.log("Usuário não encontrado");
            return res.status(401).json({ message: 'Usuário não encontrado' });
        }

        const isPasswordValid = bcrypt.compareSync(senha, user.senha_hash);
        if (!isPasswordValid) {
            console.log("Senha incorreta");
            return res.status(401).json({ message: 'Email ou senha incorretos' });
        }

        await deleteVerificationCode(email);

        const verificationCode = Math.floor(100000 + Math.random() * 900000);
        const expiration = new Date(Date.now() + 5 * 60 * 1000);

        console.log(`Salvando código ${verificationCode} para o email ${email} com expiração em ${expiration}`);
        await saveVerificationCode(email, verificationCode, expiration);

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
            text: `Seu código de confirmação é: ${verificationCode}`,
        });

        const tempToken = jwt.sign({ email }, SECRET_KEY, { expiresIn: "5m" });
        res.cookie("tempToken", tempToken, { httpOnly: true, secure: true,  maxAge: 5 * 60 * 1000 });
       
        res.json({ success: true, message: "Login bem-sucedido!" });
    } catch (err) {
        console.error('Erro no login:', err); 
        res.status(500).json({ message: 'Erro no servidor', error: err.message });
    }
};

exports.verifyCode = async (req, res) => {
    try {
        const { codigo } = req.body;
        const tempToken = req.cookies.tempToken;

        if (!tempToken) {
            return res.status(401).json({ error: "Acesso negado" });
        }

        const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
        const email = decoded.email;

        const result = await pool.query("SELECT codigo_otp FROM usuarios WHERE email = $1", [email]);

        if (result.rows.length === 0 || result.rows[0].codigo_otp !== codigo) {
            return res.status(400).json({ error: "Código incorreto" });
        }

        // Gerar novo token JWT para autenticação
        const authToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });


        res.cookie("token", authToken, { httpOnly: true });
        res.clearCookie("tempToken"); // Removendo o token temporário

        return res.json({ redirectTo: "/dashboard" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro no servidor" });
    }
};