const {addUserToDB} = require('../db');
const pendingUsers = require('./cadastrocont').pendingUsers;
const bcrypt = require('bcrypt');

exports.telapass = async (req, res) =>{
    res.render('setPassword');
};
exports.setPassword = async (req, res) => {
    const { token } = req.params;
    const { senha } = req.body;

    console.log("Token recebido:", token);
    try {
        const result = await pool.query('SELECT * FROM tokens_redefinicao WHERE token = $1', [token]);
        if (result.rows.length === 0) {
            return res.status(400).send('Token inválido ou expirado.');
        }

        const { encarregado_id, expiracao } = result.rows[0];

        if (new Date() > expiracao) {
            return res.status(400).send('Token expirado.');
        }

        const senhaHash = await bcrypt.hash(senha, 10);
        await pool.query('UPDATE encarregados SET senha_hash = $1 WHERE id = $2', [senhaHash, encarregado_id]);
        await pool.query('DELETE FROM tokens_redefinicao WHERE token = $1', [token]);

        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao definir senha.');
    }
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
    const resultado = await bcrypt.compare(confirmationCode, userData.hashcode);
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