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

const deleteVerificationCode = async (email) => {
    try {
        await pool.query("UPDATE usuarios SET codigo_verificacao = NULL, expiracao_codigo = NULL WHERE email = $1", [email]);
        console.log("Código de verificação removido com sucesso para o email:", email);
    } catch (error) {
        console.error("Erro ao deletar código de verificação:", error);
        throw error;
    }
};

const saveVerificationCode = async (email, code, expiration) => {
    try {
        await pool.query(
            "UPDATE usuarios SET codigo_verificacao = $1, expiracao_codigo = $2 WHERE email = $3",
            [code, expiration, email]
        );
        console.log("Código de verificação salvo com sucesso para o email:", email);
    } catch (error) {
        console.error("Erro ao salvar código de verificação:", error);
        throw error;
    }
};

const verifyVerificationCode = async (email, enteredCode) => {
    try {
        const query = "SELECT codigo_verificacao, expiracao_codigo FROM usuarios WHERE email = $1";
        const { rows } = await pool.query(query, [email]);

        if (rows.length === 0) {
            return { success: false, message: "Usuário não encontrado." };
        }

        const { codigo_verificacao, expiracao_codigo } = rows[0];

        // Verifica se o código expirou
        if (!codigo_verificacao || new Date(expiracao_codigo) < new Date()) {
            return { success: false, message: "Código expirado ou inválido." };
        }

        // Compara o código digitado com o hash salvo no banco
        const isCodeValid = await bcrypt.compare(enteredCode, codigo_verificacao);
        if (!isCodeValid) {
            return { success: false, message: "Código inválido." };
        }

        return { success: true, message: "Código verificado com sucesso!" };

    } catch (error) {
        console.error("Erro ao verificar código de verificação:", error);
        throw error;
    }
};
module.exports = {
    checkIfEmailExists,
    checkIfUsernameExists,
    addUserToDB,
    findUserByEmail,
    deleteVerificationCode,
    saveVerificationCode,
};