const { findUserByEmail, createCode, deleteCode, findCode } = require('../db');
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
    console.log("Recebendo login:", email); // 🔹 Log para verificar a entrada

    try {
        const user = await findUserByEmail(email);
        console.log("Usuário encontrado:", user); // 🔹 Log para verificar se o usuário existe

        if (!user) {
            console.log("Usuário não encontrado");
            return res.status(401).json({ message: 'Usuário não encontrado' });
        }

        const isPasswordValid = bcrypt.compareSync(senha, user.senha_hash);
        console.log("Senha válida?", isPasswordValid); // 🔹 Log para verificação da senha

        if (!isPasswordValid) {
            console.log("Senha incorreta");
            return res.status(401).json({ message: 'Email ou senha incorretos' });
        }

        console.log("Login bem-sucedido!"); // 🔹 Log para confirmar sucesso

        res.json({ success: true, message: "Login bem-sucedido!" });
    } catch (err) {
        console.error('Erro no login:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};


exports.verifyCode = async (req, res) => {
    const { codigo } = req.body;
    const email = req.session.email; // Recuperar o email da sessão

    if (!email || !codigo) {
        return res.status(400).json({ message: "Email e código são obrigatórios." });
    }

    try {
        const isValid = await findCode(email, codigo);
        if (!isValid) {
            return res.status(400).json({ message: "Código inválido ou expirado." });
        }

        // Gerar token JWT
        const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '30d' });

        // Configurar cookie
        res.cookie('token', token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });

        // Deletar o código após a confirmação
        await deleteCode(email);

        // Redirecionar para a página principal
        res.json({ message: "Código validado com sucesso!", token });
    } catch (error) {
        console.error("Erro na confirmação:", error);
        res.status(500).json({ message: "Erro interno no servidor." });
    }
};