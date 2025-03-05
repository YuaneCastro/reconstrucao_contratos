const {verifyVerificationCode, findUserByEmail, deleteVerificationCode, saveVerificationCode, sendVerificationEmail, deleteCode, findCode } = require('../db');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'sua_chave_secreta';
const crypto = require("crypto");

exports.showLoginPage = (req, res) => {
    res.render('login');
};

exports.showVerifyCodePage = (req, res) => {
    res.render('confirmlog');
};

exports.loginEVerificar = async (req, res) => {
    const { email, senha, codigo } = req.body;

    if (!email) {
        return res.status(400).json({ message: "E-mail obrigatório!" });
    }

    try {
        // 1️⃣ Buscar usuário no banco
        const userQuery = "SELECT * FROM usuarios WHERE email = $1";
        const { rows } = await pool.query(userQuery, [email]);

        if (rows.length === 0) {
            return res.status(400).json({ message: "Usuário não encontrado!" });
        }

        const user = rows[0];

        // 2️⃣ Se o código ainda NÃO foi digitado, significa que é um login normal
        if (!codigo) {
            const senhaCorreta = await bcrypt.compare(senha, user.senha_hash);

            if (!senhaCorreta) {
                return res.status(400).json({ message: "Senha incorreta!" });
            }

            // 3️⃣ Criar um código de verificação aleatório e salvar no banco
            const verificationCode = crypto.randomInt(100000, 999999).toString();
            const hashedCode = await bcrypt.hash(verificationCode, 10);

            await pool.query(
                "UPDATE usuarios SET codigo_verificacao = $1, expiracao_codigo = NOW() + INTERVAL '10 minutes' WHERE email = $2",
                [hashedCode, email]
            );

            console.log(`Código enviado para ${email}: ${verificationCode}`);

            return res.status(200).json({ step: "verify", message: "Código enviado. Verifique seu e-mail." });
        }

        // 4️⃣ Se já tem um código digitado, verificar se está correto
        const match = await bcrypt.compare(codigo, user.codigo_verificacao);

        if (!match) {
            return res.status(400).json({ message: "Código incorreto!" });
        }

        // 5️⃣ Se tudo certo, limpar o código do banco e autenticar o usuário
        await pool.query("UPDATE usuarios SET codigo_verificacao = NULL WHERE email = $1", [email]);

        res.status(200).json({ step: "success", message: "Login realizado com sucesso!" });
    } catch (error) {
        console.error("Erro no login/verificação:", error);
        res.status(500).json({ message: "Erro no servidor. Tente novamente." });
    }
};