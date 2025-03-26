const { findEmail, atualizar_login_cordenacao, enviar_codigo, buscar_codigoUTP, deleteVerificationCode, saveVerificationCode, verifyVerificationCode} = require('../db');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;
require('dotenv').config();


//___________________ENCARREGADOS____________________
exports.tela_login_ecarregados = (req, res) => {
    res.render('login/login');
};
exports.tela_verificacao_code_encarregados = (req, res) => {
    res.render('login/confirmlog');
};

exports.fazer_login = async (req, res) => {
    const { email, senha } = req.body;
    console.log("Recebendo login:", email); 
    console.log("📩 Dados recebidos:", req.body);

    try {
        const user = await findEmail(email);
        if (!user) {
            console.log("Usuário não encontrado");
            return res.status(401).json({ message: 'Usuário não encontrado' });
        }

        const senha_has = user?.senha_hash
        if (!user.senha_hash) {
            console.log("Erro: senha_hash não encontrada no banco!");
            return res.status(500).json({ message: 'Erro interno no servidor' });
        }

        const isPasswordValid = await bcrypt.compare(senha, senha_has);
        if (!isPasswordValid) {
            console.log("Senha incorreta");
            return res.status(401).json({ message: 'Email ou senha incorretos' });
        }

        await deleteVerificationCode(email);
        res.clearCookie("tempToken");
        const verificationCode = Math.floor(100000 + Math.random() * 900000);
        const expiration = new Date(Date.now() + 5 * 60 * 1000);
        const codigo = await bcrypt.hash(verificationCode.toString(), 10);
        console.log(`Salvando código ${verificationCode} para o email ${email} com expiração em ${expiration}`);
        await saveVerificationCode(email, codigo, expiration);

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
exports.verificar_code = async (req, res) => {
    const { codigo } = req.body;
    const tempToken = req.cookies.tempToken;

    if (!codigo || !tempToken) {
        return res.status(400).json({ message: "Código é obrigatório ou Token expirado/inválido." });
    }

    try {
        const decoded = jwt.verify(tempToken, SECRET_KEY);
        const email = decoded.email;

        const verificationResult = await verifyVerificationCode(email, codigo); 
        if (verificationResult.success === false) {
            return res.status(400).json({ message: verificationResult.message });
        }
        console.log("🟡 Resultado da verificação:", verificationResult);
        await deleteVerificationCode(email);

        const authToken = jwt.sign({ email }, process.env.TOKEN_SECRET, { expiresIn: "30d" });
        res.cookie("token", authToken, { httpOnly: true, secure: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
        res.clearCookie("tempToken");
        res.redirect('/dashboard')
    } catch (error) {
        console.error("Erro na confirmação:", error);
        res.status(500).json({ message: "Erro interno no servidor."});
    }
};



//___________________COMPLEXO ESCOLAR____________________
exports.tela_login_cordenacao = (req, res) => {
    res.render('login/login-cordenacao');
};
exports.login_cordenacao = async (req, res) => {
    const email = process.env.EMAIL_USER;

    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    const bcrypt_code = await bcrypt.hash(verificationCode.toString(), 10);

    const ip_user = req.ip  || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    await enviar_codigo(email, bcrypt_code, ip_user);
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: '"Código de Verificação - Coordenação',
        text: `Seu código de verificação é: ${verificationCode}`,
    });
    const tempToken = jwt.sign({ ip_user }, SECRET_KEY, { expiresIn: "5m" });
    res.cookie("tempToken", tempToken, { httpOnly: true, secure: true,  maxAge: 5 * 60 * 1000 });
    res.json({ success: true });
};

exports.verificar_login_cordenacao = async (req,res) => {
   try{ 
    const {codigo} = req.body;
    const tempToken = req.cookies.tempToken;

    if (!codigo || !tempToken) {
        return res.status(400).json({ message: "Código é obrigatório ou Token expirado/inválido." });
    }
    // Decodificar o token para pegar o IP do usuário
    const decoded = jwt.verify(tempToken, SECRET_KEY);
    const ip_user = decoded.ip_user;
    const email = process.env.EMAIL_USER;

    // Buscar o código OTP mais recente para o e-mail
    const result = await buscar_codigoUTP(ip_user, email);
    if (result.rows.length === 0) {
        return res.status(400).json({ success: false, message: "Código inválido ou expirado." });
    }
     const {id, codigo_otp} = result.rows[0];
     const match = await bcrypt.compare(codigo, codigo_otp);
        if (!match) {
            return res.status(400).json({ success: false, message: "Código incorreto." });
        }
    await atualizar_login_cordenacao(id);
    res.json({ success: true, redirect: "/dashboard" });
    }catch(error){
        Touch error
    }
}