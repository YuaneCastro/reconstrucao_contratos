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

const createcode = async(email,confcode) => {
     const query = 'INSERT INTO otps (codigo_verificacao) VALUES ($1)RETURNING *;';
     const values = [userId, code, expirationTime];
     try {
        const { rows } = await pool.query(query, values);
        console.log("OTP criado com sucesso:");
        return rows[0];
    } catch (error) {
        console.error("Erro ao criar OTP:", error);
        throw error;
    }
}

const deleteOTP = async (email) => {
    const query = `UPDATE usuarios SET codigo_verificacao = NULL WHERE email = $1;`;
    try {
        await pool.query(query, [email]);
        console.log("Código removido com sucesso.");
    } catch (error) {
        console.error("Erro ao deletar codigo:", error);
        throw error;
    }
};

const findCode  = async (email, inputCode) => {
    const query = `SELECT codigo_verificacao FROM usuarios WHERE email = $1;`;
    const values = [userId];

    try {
        const { rows } = await pool.query(query, values);
        if (rows.length === 0) return null;
        const otp = rows[0];
        if (new Date() > new Date(otp.expires_at)) {
            await deleteOTP(userId); // Exclui OTP expirado
            return null; // Retorna null se expirado
        }
        return otp;
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
    findOTPByUserId,
};
