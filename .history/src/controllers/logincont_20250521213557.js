const { buscar_role, findEmail, atualizar_login_coordenacao, enviar_codigo, buscar_codigoOTP, deleteVerificationCode, saveVerificationCode, verifyVerificationCode} = require('../db');
const bcrypt = require('bcryptjs');
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
    //console.log("Recebendo login:", email); 
    //console.log("📩 Dados recebidos:", req.body);

    try {
        const user = await findEmail(email);
        if (!user) {
            //console.log("Usuário não encontrado");
            return res.status(401).json({ message: 'Usuário não encontrado' });
        }

        const senha_has = user?.senha_hash
        if (!user.senha_hash) {
           // console.log("Erro: senha_hash não encontrada no banco!");
            return res.status(500).json({ message: 'Erro interno no servidor' });
        }

        const isPasswordValid = await bcrypt.compare(senha, senha_has);
        if (!isPasswordValid) {
            //console.log("Senha incorreta");
            return res.status(401).json({ message: 'Email ou senha incorretos' });
        }

        await deleteVerificationCode(email);
        res.clearCookie("tempToken");
        const verificationCode = Math.floor(100000 + Math.random() * 900000);
        const expiration = new Date(Date.now() + 5 * 60 * 1000);
        const codigo = await bcrypt.hash(verificationCode.toString(), 10);
        //console.log(`Salvando código ${verificationCode} para o email ${email} com expiração em ${expiration}`);
        await saveVerificationCode(email, codigo, expiration);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Confirmação de login',
            text: `Seu código de confirmação é: ${verificationCode}`,
        });
        const tempToken = jwt.sign({ email}, SECRET_KEY, { expiresIn: "5m" });
        res.cookie("tempToken", tempToken, { httpOnly: true, secure: true,  maxAge: 5 * 60 * 1000 });
       
        res.json({ success: true});
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
        //console.log("🟡 Resultado da verificação:", verificationResult);
        await deleteVerificationCode(email);
        const role = await buscar_role(email);

        const authToken = jwt.sign({ email, role }, process.env.TOKEN_SECRET, { expiresIn: "30d" });
        res.cookie("token", authToken, { httpOnly: true, secure: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
        res.clearCookie("tempToken");
        res.status(200).json({ success: true });
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
    res.clearCookie("tempToken");
    const email = process.env.EMAIL_USER;
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    const bcrypt_code = await bcrypt.hash(verificationCode.toString(), 10);

    const emial_secretaria = process.env.EMAIL_USER_SECRETARIA;
    const verificationCode_secretaria = Math.floor(100000 + Math.random() * 900000);
    const bcrypt_code_secretaria = await bcrypt.hash(verificationCode_secretaria.toString(), 10);
    //console.log(verificationCode);
    const formatIP = (ip) => {
        return ip === "::1" ? "127.0.0.1" : ip;
    };
    const ip_user = formatIP(
        req.headers["x-forwarded-for"]?.split(",")[0] || 
        req.socket?.remoteAddress || 
        req.connection?.remoteAddress || 
        req.ip
    );
    //console.log("IP Capturado:", ip_user);

    /* -Se estiver rodando localmente, "127.0.0.1" será exibido.
       -Se estiver online, verá o IP real do usuário.       */
    const id = await enviar_codigo(email, bcrypt_code, ip_user);
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

    const id_secretaria = await enviar_codigo(email, bcrypt_code_secretaria, ip_user);
    const transporter_secretaria = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER_SECRETARIA,
            pass: process.env.EMAIL_PASS_SECRETARIA,
        },
    });
    await transporter_secretaria.sendMail({
        from: process.env.EMAIL_USER_SECRETARIA,
        to: process.env.EMAIL_USER_SECRETARIA,
        subject: '"Código de Verificação - Coordenação',
        text: `Seu código de verificação é: ${verificationCode}`,
    });

    //console.log(id);
    const tempToken = jwt.sign({ id:id, id_secretaria:id_secretaria }, SECRET_KEY, { expiresIn: "5m" });
    res.cookie("tempToken", tempToken, { httpOnly: true, secure: true,  maxAge: 5 * 60 * 1000 });
    res.json({ success: true });
};
exports.verificar_login_cordenacao = async (req,res) => {
    try {
        const { codigo } = req.body;
        const tempToken = req.cookies.tempToken;

        if (!codigo || !tempToken) {
            return res.status(400).json({ message: "Código é obrigatório ou Token expirado/inválido." });
        }

        // Decodifica o token para obter o ID do usuário
        let decoded;
        try {
            decoded = jwt.verify(tempToken, SECRET_KEY);
        } catch (error) {
            console.error("❌ Erro ao decodificar token:", error);
            return res.status(401).json({ message: "Token inválido ou expirado." });
        }

        const id = decoded.id;
        if (!id) {
            console.error("❌ ID não encontrado no token.");
            return res.status(401).json({ message: "Token inválido." });
        }

        // Buscar o código OTP mais recente para o e-mail
        const EMAIL_USER = process.env.EMAIL_USER;
        const codigo_otp = await buscar_codigoOTP(id, EMAIL_USER);
        
        //console.log("Código digitado pelo usuário:", codigo);
        //console.log("Código OTP recuperado do banco (criptografado):", codigo_otp ? codigo_otp.codigo_otp : "Nenhum código encontrado");

        if (!codigo_otp || !codigo_otp.codigo_otp) {
            return res.status(400).json({ success: false, message: "Código OTP não encontrado ou expirado." });
        }

        // Comparação do código digitado com o código armazenado (criptografado)
        const match = await bcrypt.compare(codigo, codigo_otp.codigo_otp);
        //console.log("Resultado da comparação:", match);

        if (!match) {
            return res.status(400).json({ success: false, message: "Código incorreto." });
        }

        // Atualiza login após sucesso
        const role = "coordenador";
        await atualizar_login_coordenacao(id,role);

        // Gera novo token de autenticação
        const authToken = jwt.sign({ id, role }, process.env.TOKEN_SECRET, { expiresIn: "30d" });
        res.cookie("token", authToken, { httpOnly: true, secure: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
        res.clearCookie("tempToken");

        return res.json({ success: true });
    } catch (error) {
        console.error("Erro na confirmação:", error);
        res.status(500).json({ message: "Erro interno no servidor." });
    }
};