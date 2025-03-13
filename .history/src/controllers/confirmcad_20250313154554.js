const {addUserToDB} = require('../db');
const pendingUsers = require('./cadastrocont').pendingUsers;
const bcrypt = require('bcrypt');

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
    console.log(userData.senha);
    const resultado = await bcrypt.compare(confirmationCode, userD.hashcode);
    if (!resultado) {
        console.error(`Código inválido para o e-mail: ${email}`);
        return res.status(400).send('Código de confirmação inválido.');
    }

    try {
        await addUserToDB(userData.nome, email, userData.senha); 
        pendingUsers.delete(email);
        console.log(`Usuário confirmado: ${email}`);
        res.redirect('login');

    } catch (err) {
        console.error('Erro ao adicionar usuário ao banco:', err);
        res.status(500).send('Erro ao confirmar cadastro.');
    }
};