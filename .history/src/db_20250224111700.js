const pool = require('../src/db/connection');
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
    const hashedPassword = await bcrypt.hash(senha, 10); // Criptografa antes de salvar
    const query = 'INSERT INTO usuarios (nome, email, senha_hash) VALUES ($1, $2, $3)';
    const values = [nome, email, hashedPassword];

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
        return rows[0];
    } catch (error) {
        console.error('Erro ao buscar usuário por e-mail:', error);
        throw error;
    }
};

const deleteCode = async (email) => {
    const query = `UPDATE usuarios SET codigo_verificacao = NULL WHERE email = $1;`;
    try {
        await pool.query(query, [email]);
        console.log("Código removido com sucesso.");
    } catch (error) {
        console.error("Erro ao deletar código:", error);
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