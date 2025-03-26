const pool = require('../src/db/connection');
const bcrypt = require('bcrypt');

// verificar os usuarios
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

// cadastrar encarregados e estudantes
// verifica se o estudante existe
const estudanteExiste = async (nome) => {
    const result = await pool.query('SELECT id FROM estudantes WHERE nome = $1', [nome]);
    return result.rows.length > 0;
};





// alteracoes na tabela relacionada ao usuario
const addUserToDB = async (nome, email, senha) => {
    const checkEmailQuery = `SELECT id FROM usuarios WHERE email = $1`;
    const insertUserQuery = `
        INSERT INTO usuarios (nome, email, senha_hash)
        VALUES ($1, $2, $3) RETURNING id
    `;

    try {
        // Verifica se o e-mail já está cadastrado
        const emailCheck = await pool.query(checkEmailQuery, [email]);

        if (emailCheck.rows.length > 0) {
            throw new Error(`O e-mail ${email} já está cadastrado.`);
        }

        // Insere o usuário no banco
        const { rows } = await pool.query(insertUserQuery, [nome, email, senha]);

        const userId = rows[0].id;

        // Registra o evento no histórico
        await logEvent(userId, "Cadastro", `Usuário ${nome} (${email}) foi cadastrado.`);

        console.log(`Usuário ${email} adicionado ao banco com sucesso!`);
        return userId;
    } catch (error) {
        console.error("Erro ao adicionar usuário ao banco:", error.message);
        throw error;
    }
};
const updateUser = async (id, nome, email, senhaHash) => {
    try {
        // Verifica se o usuário existe pelo ID
        const userQuery = 'SELECT * FROM usuarios WHERE id = $1';
        const { rows } = await pool.query(userQuery, [id]);
        
        if (rows.length === 0) {
            throw new Error('Usuário não encontrado');
        }
        const existingUser = rows[0];

        // Verifica se o novo e-mail já está em uso por outro usuário
        if (email && email !== existingUser.email && await checkIfEmailExists(email)) {
            throw new Error('O e-mail já está em uso');
        }

        // Verifica se o novo nome já está em uso por outro usuário
        if (nome && nome !== existingUser.nome && await checkIfUsernameExists(nome)) {
            throw new Error('O nome já está em uso');
        }

        // Monta a query de atualização dinamicamente
        let updateQuery = 'UPDATE usuarios SET atualizado_em = now()';
        const values = [];
        let index = 1;

        if (nome) {
            updateQuery += `, nome = $${index}`;
            values.push(nome);
            index++;
        }
        if (email) {
            updateQuery += `, email = $${index}`;
            values.push(email);
            index++;
        }
        if (senhaHash) {
            updateQuery += `, senha_hash = $${index}`;
            values.push(senhaHash);
            index++;
        }

        updateQuery += ` WHERE id = $${index}`;
        values.push(id);

        await pool.query(updateQuery, values);
        await logEvent(id, "Atualização", `Usuário ID ${id} atualizou suas informações.`);
        return { message: 'Usuário atualizado com sucesso' };
    } catch (error) {
        throw error;
    }
};
const deleteUser = async (id) => {
    const query = 'DELETE FROM usuarios WHERE id = $1 RETURNING *';
    const values = [id];

    try {
        const { rows } = await pool.query(query, values);
        return rows[0];
    } catch (error) {
        throw error;
    }
};
const verifyUserLogin = async(email, senha)=>{
    try {
        const query = 'SELECT * FROM usuarios WHERE email = $1';
        const { rows } = await pool.query(query, [email]);

        if (rows.length === 0) {
            console.log("Usuário não encontrado");
            return { status: 401, message: "Usuário não encontrado" };
        }

        const user = rows[0];

        console.log("Senha digitada:", senha);
        console.log("Hash salvo no banco:", user.senha_hash);
        // Verificando senha
        if (!user.senha_hash) {
            console.log("Erro: senha_hash não encontrada no banco!");
            return { status: 500, message: "Erro interno no servidor" };
        }

        
        const bcrypt = require('bcrypt');
        const isPasswordValid = bcrypt.compareSync(senha.trim(), user.senha_hash.trim());

        if (!isPasswordValid) {
            console.log("Senha incorreta!!!!!!!!!!");
            return { status: 401, message: "Email ou senha incorretos" };
        }

        return { status: 200, user };
    } catch (error) {
        console.error("Erro ao verificar login:", error);
        return { status: 500, message: "Erro no servidor" };
    }
};


// codigos de confirmacao
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

        /*console.log("Código salvo no banco:", codigo_verificacao);
        console.log("Código digitado:", code);
        console.log("Tipos:", typeof codigo_verificacao, typeof code);
        console.log("Os códigos são iguais?", codigo_verificacao === code);

        console.log("Data atual:", new Date());
        console.log("Data de expiração do código:", expiracao_codigo);
        console.log("O código expirou?", new Date() > new Date(expiracao_codigo));
        */

        // compara o codigo do usuario com o hash do banco de dados retorna true e false
        const certo = await bcrypt.compare(code, codigo_verificacao);

        if (!codigo_verificacao || !expiracao_codigo) {
            return { success: false, message: "Nenhum código registrado." };
        }
        
        // caso for falso senao vai proseguir o codigo na normalidade
        if (!certo) {
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


// log de atividades
const logEvent = async (usuario_id, tipo_evento, descricao) => {
    const query = `
        INSERT INTO historico_eventos (usuario_id, tipo_evento, descricao)
        VALUES ($1, $2, $3)
    `;
    const values = [usuario_id, tipo_evento, descricao];

    try {
        await pool.query(query, values);
        console.log(`Evento registrado: ${tipo_evento} para o usuário ID ${usuario_id}`);
    } catch (error) {
        console.error("Erro ao registrar evento no histórico:", error);
        throw error;
    }
};
const getLogEvents = async (usuario_id) => {
    const query = `
    SELECT tipo_evento, descricao, ocorrido_em 
    FROM historico_eventos 
    WHERE usuario_id = $1 
    ORDER BY ocorrido_em DESC
`;
    try {
        const result = await pool.query(query, [usuario_id]);
        return result.rows;
    } catch (error) {
        console.error("Erro ao buscar eventos do histórico:", error);
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
    verifyVerificationCode,
    verifyUserLogin,
    updateUser,
    deleteUser,
    getLogEvents
};