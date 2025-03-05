const pool = require('./db/connection'); // Certifique-se de que o caminho para 'connection.js' está correto

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

const createOTP = async(userId, code) => {
     const query = 'INSERT INTO ots (user_id, otp_code, expires_at) VALUES ($1, $2, $3)';
     const values = [userId, code];
     try {
        await pool.query(query, values);
    } catch (error) {
        console.error("Erro ao criar OTP:", error);
        throw error;
    }
}

const deleteOTP = async (userId) => {
    const query = "DELETE FROM otp_codes WHERE user_id = $1";
    const values = [userId];

    try {
        await pool.query(query, values);
    } catch (error) {
        console.error("Erro ao deletar OTP:", error);
        throw error;
    }
};

const findOTP = async (userId, code) => {
    const query = "SELECT * FROM otp_codes WHERE user_id = $1 AND code = $2";
    const values = [userId, code];

    try {
        const { rows } = await pool.query(query, values);
        return rows[0];
    } catch (error) {
        console.error("Erro ao buscar OTP:", error);
        throw error;
    }
};

module.exports = {
    checkIfEmailExists,
    checkIfUsernameExists,
    addUserToDB,
    findUserByEmail,
    createOTP,
    deleteOTP,
    findOTP,

};
