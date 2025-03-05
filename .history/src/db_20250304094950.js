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

const 

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
            `UPDATE usuarios 
             SET codigo_verificacao = $1, expiracao_codigo = $2 
             WHERE email = $3`,
            [code, expiration, email]
        );
        console.log(`✅ Código ${code} salvo para ${email} até ${expiration}`);
    } catch (error) {
        console.error("❌ Erro ao salvar código:", error);
        throw error;
    }
};

const verifyVerificationCode = async (email, code) => {
    try {
        const result = await pool.query(
            `SELECT codigo_verificacao, expiracao_codigo FROM usuarios WHERE email = $1`,
            [email]
        );

        if (result.rows.length === 0) {
            console.log("❌ Email não encontrado.");
            return { success: false, message: "Usuário não encontrado." };
        }

        const { codigo_verificacao, expiracao_codigo } = result.rows[0];

        if (!codigo_verificacao || !expiracao_codigo) {
            return { success: false, message: "Nenhum código registrado." };
        }

        if (codigo_verificacao !== code) {
            return { success: false, message: "Código inválido." };
        }

        if (new Date() > expiracao_codigo) {
            return { success: false, message: "Código expirado." };
        }

        console.log(`✅ Código ${code} validado para ${email}`);
        return { success: true };
    } catch (error) {
        console.error("❌ Erro ao verificar código:", error);
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
    verifyVerificationCode
};