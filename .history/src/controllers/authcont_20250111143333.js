const { storeCode, getCode, deleteCode } = require('../config/redisConfig');
const sendEmail = require('../config/emailConfig');
const crypto = require('crypto');

/**
 * Gera um código de confirmação de 5 dígitos.
 * @returns {string} Código gerado.
 */
function generateConfirmationCode() {
    return crypto.randomInt(10000, 99999).toString(); // Código de 5 dígitos
}

/**
 * Envia um código de confirmação para o e-mail do usuário.
 * @param {object} req - Requisição Express.
 * @param {object} res - Resposta Express.
 */
async function sendConfirmationCode(req, res) {
    const { email } = req.body;

    // Gera código e armazena no Redis
    const code = generateConfirmationCode();
    storeCode(email, code);

    // Envia por e-mail
    try {
        await sendEmail(email, 'Código de Confirmação', `Seu código é: ${code}`);
        res.status(200).send('Código de confirmação enviado para o seu e-mail!');
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        res.status(500).send('Erro ao enviar e-mail.');
    }
}

/**
 * Valida o código enviado pelo usuário.
 * @param {object} req - Requisição Express.
 * @param {object} res - Resposta Express.
 */
function validateConfirmationCode(req, res) {
    const { email, code } = req.body;

    getCode(email, (err, storedCode) => {
        if (err) return res.status(500).send('Erro no servidor.');
        if (!storedCode) return res.status(400).send('Código expirado ou inexistente.');

        if (storedCode === code) {
            deleteCode(email); // Remove o código do Redis
            res.status(200).send('Código validado com sucesso!');
        } else {
            res.status(400).send('Código inválido.');
        }
    });
}


module.exports = { sendConfirmationCode, validateConfirmationCode };
