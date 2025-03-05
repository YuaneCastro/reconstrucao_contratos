const redis = require('redis');
const client = redis.createClient();

client.on('error', (err) => console.error('Erro no Redis:', err));

/**
 * Armazena o código com um TTL (Tempo de Vida).
 * @param {string} email - O e-mail do usuário.
 * @param {string} code - O código de confirmação.
 */
function storeCode(email, code) {
    client.setex(email, 300, code); // Expira em 5 minutos
}

/**
 * Recupera o código armazenado para um e-mail.
 * @param {string} email - O e-mail do usuário.
 * @param {function} callback - Callback para retornar o código.
 */
function getCode(email, callback) {
    client.get(email, callback);
}

/**
 * Remove o código de confirmação após validação.
 * @param {string} email - O e-mail do usuário.
 */
function deleteCode(email) {
    client.del(email);
}

module.exports = { storeCode, getCode, deleteCode };
