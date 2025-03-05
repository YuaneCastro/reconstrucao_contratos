const bcrypt = require('bcrypt');
const pool = require('../db');

const pendingUsers = new Map(); 

exports.showConfirmationPage = (req, res) => {
    const email = req.query.email;

    if (!email || !pendingUsers.has(email)) {
        return res.redirect('/register'); // Redireciona para o registro se não há email válido
    }
    const userData = pendingUsers.get(email);
    const timeLeft = Math.max(0, userData.expiresAt - Date.now());
    res.render('confirm'), {
        email,
        timeLeft,
        attempts: userData.attempts,
    };
};

exports.handleConfirmation = async (req, res) => {
    const { email, confirmationCode } = req.body;

    if (!pendingUsers.has(email)) {
        return res.status(400).send('Código inválido ou já expirado. Cadastre-se novamente.');
    }

    const userData = pendingUsers.get(email);
    const currentTime = Date.now();

    // Verifica se o código expirou
    if (userData.expiresAt < currentTime) {
        return res.status(400).send('O código expirou. Por favor, solicite um novo código.');
    }

    // Verifica o número de tentativas restantes
    if (userData.attempts <= 0) {
        pendingUsers.delete(email);
        return res.status(400).send('Número máximo de tentativas excedido. Cadastre-se novamente.');
    }

    // Verifica se o código está correto
    if (userData.confirmationCode !== confirmationCode) {
        userData.attempts -= 1; // Decrementa as tentativas
        return res.status(400).send(`Código incorreto. Tentativas restantes: ${userData.attempts}`);
    }

    try {
        const hashedPassword = await bcrypt.hash(userData.senha, 10);

        // Salvando o usuário no banco de dados
        await pool.query(
            'INSERT INTO usuarios (nome, email, senha_hash) VALUES ($1, $2, $3)',
            [userData.nome, email, hashedPassword]
        );

        pendingUsers.delete(email);  // Remove dos pendentes após sucesso
        res.redirect('/auth/login'); // Redireciona para a página de login
    } catch (error) {
        console.error('Erro ao confirmar cadastro:', error);
        res.status(500).send('Erro ao confirmar cadastro.');
    }
};
