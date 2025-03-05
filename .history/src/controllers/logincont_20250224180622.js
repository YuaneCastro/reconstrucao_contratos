const {verifyVerificationCode, findUserByEmail, deleteVerificationCode, saveVerificationCode, sendVerificationEmail, deleteCode, findCode } = require('../db');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'sua_chave_secreta';


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
        console.log("Usuário encontrado:", user); 

        if (!user) {
            console.log("Usuário não encontrado");
            return res.status(401).json({ message: 'Usuário não encontrado' });
        }

        const isPasswordValid = bcrypt.compareSync(senha, user.senha_hash);
        console.log("Senha válida?", isPasswordValid); 

        if (!isPasswordValid) {
            console.log("Senha incorreta");
            return res.status(401).json({ message: 'Email ou senha incorretos' });
        }
        await deleteVerificationCode(user.id);
        const verificationCode = Math.floor(100000 + Math.random() * 900000); 
        await saveVerificationCode(user.id, verificationCode);
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
        res.json({ success: true, message: "Login bem-sucedido!" });
    } catch (err) {
        console.error('Erro no login:', err); // 🔹 Adicionando log do erro real
        res.status(500).json({ message: 'Erro no servidor', error: err.message });
    }
};

exports.verificarCodigo = async (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ message: "E-mail e código são obrigatórios!" });
    }

    try {
        // 1️⃣ Buscar o código no banco
        const query = "SELECT codigo_verificacao FROM usuarios WHERE email = $1";
        const { rows } = await pool.query(query, [email]);

        if (rows.length === 0 || !rows[0].codigo_verificacao) {
            return res.status(400).json({ message: "Código inválido ou expirado!" });
        }

        const codigoHash = rows[0].codigo_verificacao;

        // 2️⃣ Comparar o código digitado com o hash salvo
        const match = await bcrypt.compare(code, codigoHash);

        if (!match) {
            return res.status(400).json({ message: "Código incorreto!" });
        }

        // 3️⃣ Se o código for válido, apagar ele do banco
        await pool.query("UPDATE usuarios SET codigo_verificacao = NULL WHERE email = $1", [email]);

        res.status(200).json({ message: "Código verificado com sucesso!" });
    } catch (error) {
        console.error("Erro ao verificar código:", error);
        res.status(500).json({ message: "Erro no servidor. Tente novamente." });
    }
};