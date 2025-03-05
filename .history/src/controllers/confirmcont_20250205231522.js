const {addUserToDB, deleteOTP, findOTP} = require('../db');
const jwt = require('jsonwebtoken'); // Biblioteca para gerar o token
const secretKey = 'sua_chave_secreta';
const pendingUsers = require('./cadastrocont').pendingUsers;

exports.showConfirmationPage = (req, res) => {
    res.render('confirmcad');
};

exports.showpageconflogin= (req, res) => {
    res.render('confirmlog');
};

exports.confirmCode = async (req, res) => {
    const { confirmationCode } = req.body; // Código enviado pelo usuário
    const email = req.session.pendingEmail; // E-mail armazenado na sessão

    // Verificar se o e-mail existe na sessão e no mapa de usuários pendentes
    if (!email || !pendingUsers.has(email)) {
        console.error(`Usuário não encontrado na sessão ou pendentes: ${email}`);
        return res.status(404).send('Usuário não encontrado ou já confirmado.');
    }

    // Obter os dados do usuário nos pendentes
    const userData = pendingUsers.get(email);

    // Comparar o código fornecido pelo usuário com o armazenado
    if (userData.confirmationCode !== confirmationCode) {
        console.error(`Código inválido para o e-mail: ${email}`);
        return res.status(400).send('Código de confirmação inválido.');
    }

    // Confirmar usuário: adicionar ao banco de dados e remover dos pendentes
    try {
        await addUserToDB(userData.nome, email, userData.senha); // Função para adicionar ao banco
        pendingUsers.delete(email); // Remover do mapa de pendentes
        console.log(`Usuário confirmado: ${email}`);
        res.status(200).send('Cadastro confirmado com sucesso!');

    } catch (err) {
        console.error('Erro ao adicionar usuário ao banco:', err);
        res.status(500).send('Erro ao confirmar cadastro.');
    }
};

exports.confirmCodelogin = async (req, res) => {
    const { confirmationCode } = req.body;
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


