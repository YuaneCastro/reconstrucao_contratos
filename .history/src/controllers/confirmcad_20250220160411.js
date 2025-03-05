const {addUserToDB} = require('../db');
const pendingUsers = require('./cadastrocont').pendingUsers;

exports.showConfirmationPage = (req, res) => {
    res.render('confirmcad');
};

exports.confirmCode = async (req, res) => {
    const { confirmationCode } = req.body;
    const email = req.session.pendingEmail; 

    if (!email || !pendingUsers.has(email)) {
        console.error(`Usuário não encontrado na sessão ou pendentes: ${email}`);
        return res.status(404).send('Usuário não encontrado ou já confirmado.');
    }

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