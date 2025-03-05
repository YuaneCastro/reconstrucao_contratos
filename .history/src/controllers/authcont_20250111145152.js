const { generateConfirmationCode, storeCode } = require('../config/utils');
const { sendEmail } = require('../config/emailConfig');

exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Simulação: Armazene o usuário no banco de dados (excluindo confirmação por enquanto)
        console.log(`Usuário registrado: ${username}, ${email}`);

        // Gerar e armazenar o código de confirmação temporariamente
        const code = generateConfirmationCode();
        storeCode(email, code);

        // Enviar o código de confirmação para o email
        await sendEmail(email, 'Código de Confirmação', `Seu código é: ${code}`);

        // Redirecionar para a página de confirmação
        res.redirect(`/confirm/send-code?email=${encodeURIComponent(email)}`);
    } catch (error) {
        console.error('Erro ao cadastrar:', error);
        res.status(500).send('Erro ao cadastrar o usuário.');
    }
};
