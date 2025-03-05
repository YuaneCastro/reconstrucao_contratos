const {addUserToDB, deleteOTP, findOTP} = require('../db');
const jwt = require('jsonwebtoken'); // Biblioteca para gerar o token
const secretKey = 'sua_chave_secreta';

exports.showpageconflogin = (req, res) => {
    res.render('confirmlog');
};

exports.confirmCodelogin = async (req, res) => {
    const { confirmationlog } = req.body;
    const email = req.session.email; // Pegando email da sessão

    if (!email) {
        return res.redirect("/login");
    }

    try {
        const otpData = await findOTP(email); // Busca o código do banco

        if (!otpData || otpData.otp !== confirmationCode) {
            return res.status(400).send("Código inválido.");
        }

        // Se o código estiver correto, deletamos o OTP usado
        await deleteOTP(email);

        // Criamos um token de autenticação
        const token = jwt.sign({ email }, secretKey);

        // Salvamos nos cookies
        req.session.authToken = token;

        // Redirecionamos para a página principal
        return res.redirect("/telap");
    } catch (error) {
        console.error("Erro ao confirmar código de login:", error);
        return res.status(500).send("Erro interno no servidor.");
    }
};


