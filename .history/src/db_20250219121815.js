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
    const hashedCode = await bcrypt.hash(code, 10); // Criptografar o código antes de salvar
    const query = `UPDATE usuarios SET codigo_verificacao = $1 WHERE email = $2;`;
    try {
        await pool.query(query, [hashedCode, email]);
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

        if (rows.length === 0) {
            console.log(`Nenhum usuário encontrado com o email: ${email}`);
            return false;
        }

        const savedCode = rows[0].codigo_verificacao;

        if (!savedCode) {
            console.log(`Nenhum código de verificação encontrado para o email: ${email}`);
            return false;
        }

        if (typeof inputCode !== "string") {
            console.log(`Código digitado inválido: "${inputCode}"`);
            return false;
        }

        console.log(`Código salvo no banco: "${savedCode}"`);
        console.log(`Código digitado: "${inputCode.trim()}"`);

        // Comparação correta usando bcrypt
        const isMatch = await bcrypt.compare(inputCode.trim(), savedCode);
        return isMatch;

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
