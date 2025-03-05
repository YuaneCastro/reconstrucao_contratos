const { findOTPByUserId, deleteOTP } = require('../db');// Biblioteca para gerar o token
const SECRET_KEY = 'sua_chave_secreta';

exports.showpageconflogin = (req, res) => {
    res.render('confirmlog');
};

exports.confirmCodelogin = async (req, res) => {
    console.log("Recebendo requisição de confirmação:", req.body);
    
    const { code } = req.body;
    const userId = req.session.tempUserId;

    console.log("Sessão antes da confirmação:", req.session);

    if (!userId) {
        console.log("Sessão expirada ou não definida.");
        return res.status(401).json({ message: 'Sessão expirada. Faça login novamente.' });
    }

    console.log("Verificando código para usuário:", userId);

    try {
        const otpEntry = await findOTPByUserId(userId);

        if (!otpEntry || otpEntry.code !== code) {
            console.log("Código inválido:", code);
            return res.status(401).json({ message: 'Código inválido ou expirado.' });
        }

        console.log("Código correto! Deletando OTP e gerando token...");

        await deleteOTP(userId);

        const token = jwt.sign({ userId }, SECRET_KEY, { expiresIn: '24h' }); 

        res.cookie('ctoken', token, { httpOnly: true, secure: true, maxAge: 24 * 60 * 60 * 1000 }); 

        console.log("Redirecionando para dashboard...");

        res.json({ success: true, redirect: "/telap" });

    } catch (error) {
        console.error("Erro na confirmação:", error);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
};
