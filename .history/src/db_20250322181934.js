const pool = require('../src/db/connection');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
require('dotenv').config();

// ______________login___________________
//busca as informacoes do usuario pelo email
const findEmail = async (email) => {
    const query = 'SELECT * FROM encarregados WHERE email = $1';
    const values = [email];

    try {
        const { rows } = await pool.query(query, values);
        return rows[0];
    } catch (error) {
        console.error('Erro ao buscar usuário por e-mail:', error);
        throw error;
    }
};
//deleta o codigo de verificacao
const deleteVerificationCode = async (email) => {
    try {
        await pool.query("UPDATE encarregados SET codigo_verificacao = NULL, codigo_expiracao = NULL WHERE email = $1", [email]);
        console.log("Código de verificação removido com sucesso para o email:", email);
    } catch (error) {
        console.error("Erro ao deletar código de verificação:", error);
        throw error;
    }
};
// armazena o codigo de confirmacao de login
const saveVerificationCode = async (email, code, expiration) => {
    try {
        await pool.query(
            `UPDATE encarregados 
             SET codigo_verificacao = $1, codigo_expiracao = $2 
             WHERE email = $3`,
            [code, expiration, email]
        );
        console.log(`✅ Código ${code} salvo para ${email} até ${expiration}`);
    } catch (error) {
        console.error("❌ Erro ao salvar código:", error);
        throw error;
    }
};
// verifica o codigo de confirmacao
const verifyVerificationCode = async (email, code) => {
    try {
        const result = await pool.query(
            `SELECT codigo_verificacao, codigo_expiracao FROM encarregados WHERE email = $1`,
            [email]
        );

        if (result.rows.length === 0) {
            console.log("❌ Email não encontrado.");
            return { success: false, message: "Usuário não encontrado." };
        }

        const { codigo_verificacao, codigo_expiracao } = result.rows[0];

        /*console.log("Código salvo no banco:", codigo_verificacao);
        console.log("Código digitado:", code);
        console.log("Tipos:", typeof codigo_verificacao, typeof code);
        console.log("Os códigos são iguais?", codigo_verificacao === code);

        console.log("Data atual:", new Date());
        console.log("Data de expiração do código:", codigo_expiracao);
        console.log("O código expirou?", new Date() > new Date(codigo_expiracao));
        */

        // compara o codigo do usuario com o hash do banco de dados retorna true e false
        const certo = await bcrypt.compare(code, codigo_verificacao);

        if (!codigo_verificacao || !codigo_expiracao) {
            return { success: false, message: "Nenhum código registrado." };
        }
        
        // caso for falso senao vai proseguir o codigo na normalidade
        if (!certo) {
            return { success: false, message: "Código inválido." };
        }

        if (new Date() > codigo_expiracao) {
            return { success: false, message: "Código expirado." };
        }

        console.log(`✅ Código ${code} validado para ${email}`);
        return { success: true };
    } catch (error) {
        console.error("❌ Erro ao verificar código:", error);
        throw error;
    }
};



// ____________________cadastrar encarregados e estudantes___________________
// verifica se o estudante existe
const estudanteExiste = async (nome) => {
    const result = await pool.query('SELECT id FROM estudantes WHERE nome = $1', [nome]);
    return result.rows.length > 0;
};
// busca o encarregado pelo email
const buscarEncarregadoPorEmail = async (email) => {
    const result = await pool.query('SELECT id FROM encarregados WHERE email = $1', [email]);
    return result.rows.length > 0 ? result.rows[0] : null;
};
const buscaridestudante = async(nome) =>{
    const result = await pool.query('SELECT FROM estudantes WHERE nome = $1 ', [])
};
// cadastra o encarregado mas sem senha
/* MOTIVO: o encarregado deve digitar a sua propria senha entao
        sera enviado um link ao seu emial onde ele pode digitar a sua 
        senha de forma segura.*/
const criarEncarregado = async (nome, email, telefone) => {
    const result = await pool.query(
        `INSERT INTO encarregados (nome, email, telefone, senha_hash, codigo_verificacao, codigo_expiracao) 
         VALUES ($1, $2, $3, NULL, NULL, NULL) 
         RETURNING id`,
        [nome, email, telefone]
    );
    return result.rows[0].id;
};
// cadastrar o estudante
const cadastrarEstudanteNoBanco = async (nome, data_nascimento, classe, turma, curso, encarregadoId) => {
    await pool.query(
        'INSERT INTO estudantes (nome, data_nascimento, classe, turma, curso, encarregado_id) VALUES ($1, $2, $3, $4, $5, $6)',
        [nome, data_nascimento, classe, turma, curso, encarregadoId]
    );
};
//Gera um token de redefinição de senha do encarregado e o armazena no banco
//OBS:nao armazena a senha somente gera o token
const gerarTokenRedefinicao = async (encarregadoId) => {
    const token = crypto.randomBytes(32).toString('hex');
    const expiracao = new Date(Date.now() + 60 * 60 * 1000); // Expira em 1 hora

    await pool.query(
        'INSERT INTO tokens_redefinicao (encarregado_id, token, expiracao) VALUES ($1, $2, $3)',
        [encarregadoId, token, expiracao]
    );

    return token;
};
const buscarToken = async (token) => {
    const result = await pool.query('SELECT * FROM tokens_redefinicao WHERE token = $1', [token]);
    return result.rows[0];
};
const adicionar_senha = async (encarregadoId, senha) => {
    const senhaHash = await bcrypt.hash(senha, 10);
    await pool.query('UPDATE encarregados SET senha_hash = $1 WHERE id = $2', [senhaHash, encarregadoId]);
};
const deletarToken = async (token) => {
    await pool.query('DELETE FROM tokens_redefinicao WHERE token = $1', [token]);
};




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





// log de atividades
const logEvent = async (encarregado_id, estudante_id, acao, detalhes) => {
    const query = `
        INSERT INTO log_atividades (encarregado_id, estudante_id, acao, detalhes)
        VALUES ($1, $2, $3, $4)
    `;
    const values = [encarregado_id, estudante_id, acao, detalhes];

    try {
        await pool.query(query, values);
        console.log(`Evento registrado: ${acao} - Usuário ID ${encarregado_id}`);
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
    findEmail,
    deleteVerificationCode,
    saveVerificationCode,
    verifyVerificationCode,
    verifyUserLogin,
    updateUser,
    deleteUser,
    getLogEvents,
    estudanteExiste,
    buscarEncarregadoPorEmail,
    criarEncarregado,
    cadastrarEstudanteNoBanco,
    gerarTokenRedefinicao,
    buscarToken,
    adicionar_senha,
    deletarToken,
    logEvent,
    buscaridestudante
};