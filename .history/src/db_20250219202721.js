const pool = require('./db/connection');
const bcrypt = require("bcrypt");

const checkIfEmailExists = async (email) => {
    const query = 'SELECT * FROM usuarios WHERE email = $1';
    const values = [email];

    try {
        const { rows } = await pool.query(query, values);
        return rows.length > 0;
    } catch (error) {
        throw error;
    }
};

const checkIfUsernameExists = async (nome) => {
    const query = 'SELECT * FROM usuarios WHERE nome = $1';
    const values = [nome];

    try {
        const { rows } = await pool.query(query, values);
        return rows.length > 0;
    } catch (error) {
        throw error;
    }
};

const addUserToDB = async (nome, email, senha) => {
    const query = 'INSERT INTO usuarios (nome, email, senha_hash) VALUES ($1, $2, $3)';
    const values = [nome, email, senha];

    try {
        await pool.query(query, values);
        console.log(`Usuário ${email} adicionado ao banco com sucesso!`);
    } catch (error) {
        throw error;
    }
};

const findUserByEmail = async (email) => {
    const query = 'SELECT * FROM usuarios WHERE email = $1';
    const values = [email];

    try {
        const { rows } = await pool.query(query, values);
        return rows[0]; // Certifique-se de que a consulta está retornando o usuário correto
    } catch (error) {
        console.error('Erro ao buscar usuário por e-mail:', error);
        throw error; // Propaga o erro
    }
};

const createCode = async (email, code) => {
    const hashedCode = await bcrypt.hash(code, 10); 
    const expirationTime = new Date(Date.now() + 5 * 60000); // Expira em 5 minutos

    const query = `UPDATE usuarios SET codigo_verificacao = $1, expiracao_codigo = $2 WHERE email = $3;`;

    try {
        await pool.query(query, [hashedCode, expirationTime, email]);
        console.log(`Código de verificação salvo para ${email}: ${hashedCode}`);
    } catch (error) {
        console.error("Erro ao salvar código:", error);
        throw error;
    }
};

const deleteCode = async (email) => {
    const query = `UPDATE usuarios SET codigo_verificacao = NULL WHERE email = $1;`;
    try {
        await pool.query(query, [email]);
        console.log("Código removido com sucesso.");
    } catch (error) {
        console.error("Erro ao deletar codigo:", error);
        throw error;
    }
};

const findCode = async (email, inputCode) => {
    const query = `SELECT codigo_verificacao FROM usuarios WHERE email = $1;`;
    try {
        const { rows } = await pool.query(query, [email]);

        if (rows.length === 0 || !rows[0].codigo_verificacao) {
            return false;
        }

        // 🔥 Comparação com bcrypt para validar código
        return await bcrypt.compare(inputCode.trim(), rows[0].codigo_verificacao);

    } catch (error) {
        console.error("Erro ao buscar código:", error);
        throw error;
    }
};


module.exports = {
    checkIfEmailExists,
    checkIfUsernameExists,
    addUserToDB,
    findUserByEmail,
    createCode,
    deleteCode,
    findCode,
};
