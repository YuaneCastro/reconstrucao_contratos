const pool = require('../src/db/connection');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
require('dotenv').config();


// log de atividades
const logEvent = async (encarregado_id, estudante_id, acao, detalhes) => {
    const query = `
        INSERT INTO log_atividades (encarregado_id, estudante_id, acao, detalhes)
        VALUES ($1, $2, $3, $4)
    `;
    const values = [encarregado_id, estudante_id, acao, detalhes];

    try {
        await pool.query(query, values);
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
const buscar_role = async (email) => {
    try{
        const result = await pool.query(`SELECT role FROM encarregados WHERE email = $1`,[email]);
        if (result.rows.length > 0) {
            return result.rows[0].role; // retorna o valor da role
        } else {
            return null; // ou false, dependendo do que você prefere
        }
    }catch(err){
        console.error("❌ Erro ao buscar role", err);
        throw err;
    }
}
const buscar_estudantes_associados = async(id) => {
    try{
        const result = await pool.query(`SELECT * FROM estudantes WHERE encarregado_id = $1`,[id])
        return result.rows;
    }catch(err){
        console.log(err);
        throw err;
    }
}
const log_atividades = async (id) => {
    try{
        const result = await pool.query(`SELECT * FROM log_atividades WHERE encarregado_id = $1`,[id])
        return result.rows;
    }catch(err){
        console.log(err);
        throw err;
    }
};


//_________________login cordenacao_______________
const enviar_codigo = async (email, bcrypt_code, ip_user) => {
    try {
        const result = await pool.query(
            `INSERT INTO logins_coordenacao (email, codigo_otp, ip, usado, data_envio, data_login) 
             VALUES ($1, $2, $3, $4, DEFAULT, DEFAULT) 
             RETURNING id`,
            [email, bcrypt_code, ip_user, false]
        );
        return result.rows[0].id;
    } catch (error) {
        console.error("❌ Erro ao salvar código:", error);
        throw error;
    }
};
const buscar_codigoOTP = async (id, email) => {
    try {
        const result = await pool.query(
            `SELECT codigo_otp FROM logins_coordenacao 
             WHERE id = $1 AND email = $2 
             ORDER BY data_envio DESC 
             LIMIT 1`,
            [id, email]
        );

        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error("❌ Erro ao buscar código OTP:", error);
        return null;
    }
};
const atualizar_login_coordenacao = async (id , role) => {
    if (!id) {
        console.error("❌ Erro: ID inválido ao atualizar login.");
        return;
    }
    try {
        await pool.query(
            "UPDATE logins_coordenacao SET usado = true, data_login = NOW(), role = $1 WHERE id = $2",
            [role, id]
        );
    } catch (error) {
        console.error("❌ Erro ao atualizar login:", error);
    }
};
const find_cordenacao = async (id) => {
    try{
        const result = await pool.query(
            "SELECT id, email, ip FROM logins_coordenacao WHERE id = $1 LIMIT 1", [id]
        );
        return result.rows.length > 0 ? result.rows[0] : null;
    }catch(error){
        console.error("❌ Erro ao buscar usuário:", error);
        throw error;
    }
};
const buscar_logs = async () =>{
    try{
        const result = await pool.query(
            `SELECT id, email, ip, data_login, usado 
             FROM logins_coordenacao 
             ORDER BY data_login DESC`
        );
        return result.rows;
    }catch(error){
        console.error("❌ Erro ao buscar todos os logs:", error);
        return [];
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
const buscarEncarregadoPorCampo = async (campo, valor) => {
    const result = await pool.query(`SELECT id FROM encarregados WHERE ${campo} = $1`,[valor]);
    return result.rows;
}
const buscaridestudante = async(nome) =>{
    const result = await pool.query('SELECT id FROM estudantes WHERE nome = $1 ', [nome]);
    return result.rows.length > 0 ? result.rows[0] : null;
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
const adicionar_senha = async (encarregadoId, senha, role) => {
    const senhaHash = await bcrypt.hash(senha, 10);
    await pool.query(`UPDATE encarregados
    SET senha_hash = $1, role = $2
    WHERE id = $3;
    `, [senhaHash, role, encarregadoId]);
};
const deletarToken = async (encarregadoId) => {
    await pool.query('DELETE FROM tokens_redefinicao WHERE encarregado_id = $1', [encarregadoId]);
};



//_________________dashboard-coordenacao____________________
const lista_encarregados = async () => {
    try{
        const result = await pool.query(`SELECT * FROM encarregados ORDER BY id DESC`);
        return result.rows;
    }catch(error){
        console.error("Erro ao buscar encarregados:", error);
        throw error;
    }
};
const lista_estudantes = async () => {
    try{
        const result = await pool.query(`SELECT * FROM estudantes ORDER BY id DESC`);
        return result.rows;
        
    }catch(error){
        console.error("Erro ao buscar encarregados:", error);
        throw error;
    }
};
const lista_coordenacao = async () => {
    try{
        const result = await pool.query(`SELECT id, ip, usado, data_envio, data_login FROM logins_coordenacao ORDER BY id DESC;        `);
        return result.rows;
    }catch(error){
        console.error("Erro ao buscar lista de coordenacao:", error)
        throw error;
    }
}
const atualizarEncarregado = async (nome, email, telefone, id) => {
    try {
        // Verifica se o nome, email ou telefone já existem, mas ignorando o encarregado atual
        const existe = await verifica_encarregado(nome, email, telefone, id);
        if (existe.length > 0) { // Se já existe um encarregado com os mesmos dados
            return {
                sucesso: false,
                motivo: "Já existe um encarregado com esse nome, email ou telefone."
            };
        }

        // Atualiza o encarregado no banco de dados
        const result = await pool.query(
            `UPDATE encarregados 
             SET nome = $1, email = $2, telefone = $3, atualizado_em = NOW() 
             WHERE id = $4`,
            [nome, email, telefone, id]
        );

        if (result.rowCount === 0) {
            return {
                sucesso: false,
                motivo: "Encarregado não encontrado."
            };
        }

        return {
            sucesso: true,
            motivo: "Encarregado atualizado com sucesso."
        };
    } catch (err) {
        console.error("Erro ao atualizar encarregado:", err);
        return {
            sucesso: false,
            motivo: "Houve um erro ao tentar atualizar o encarregado."
        };
    }
};
const verifica_encarregado = async(nome, email, telefone, id) => {
    const result = await pool.query(`SELECT * FROM encarregados 
    WHERE (nome = $1 OR email = $2 OR telefone = $3) 
    AND id != $4`,// Verifica os dados, mas ignora o próprio encarregado
    [nome, email, telefone, id]);
    return result.rows;
}
const atualizar_estudante = async (id, nome, classe, turma, curso) => {
    try{
        await pool.query(`UPDATE estudantes SET nome = $1, classe = $2, turma = $3, curso = $4 WHERE id = $5`,
        [nome, classe, turma, curso || null, id]);
    }catch(err){
        console.error("Erro ao atualizar estudante:", err);
    }
}
const verifica_estudante = async (nome, id) => {
    const result = await pool.query('SELECT * FROM estudantes WHERE nome = $1 AND id != $2', [nome, id]);
    return result.rows;
};
const eliminar_log = async (id) => {
    await pool.query('DELETE FROM log_atividades WHERE encarregado_id = $1', [id]);
};
const eliminar_dos_tokens = async (id) => {
    await pool.query('DELETE FROM tokens_redefinicao WHERE encarregado_id = $1', [id]);
};
const eliminar_estudantes = async (id) => {
    await pool.query('DELETE FROM estudantes WHERE encarregado_id = $1', [id]);
};
const eliminar_encarregado = async (id) => {
    await pool.query('DELETE FROM encarregados WHERE id = $1', [id]);
};
const eliminar_tudo = async (id) => {
    try {
        // Aqui, não estamos usando transações explícitas como antes, mas as operações de delete serão feitas sequencialmente.
        await eliminar_log(id);
        await eliminar_dos_tokens(id);
        await eliminar_estudantes(id);
        await eliminar_encarregado(id);

        return {
            sucesso: true,
            motivo: "Encarregado e todos os registros relacionados foram removidos com sucesso."
        };
    } catch (err) {
        console.error("Erro ao tentar excluir o encarregado:", err);

        return {
            sucesso: false,
            motivo: "Houve um erro ao tentar deletar o encarregado e seus rastros."
        };
    }
};
const buscar_encarregado_id = async (id) => {
    try{
        const result = await pool.query(`SELECT nome, email FROM encarregados WHERE id = $1`,[id]);
        return result.rows[0];
    }catch(err){
        console.log(err);
        throw err;
    }
}
const guardar_documento_e_enviar = async (tipo, titulo, descricao, especificacoes, enviarParaTodos) => {
    try {
        const result = await pool.query(
            `INSERT INTO documentos (tipo, titulo, descricao)
             VALUES ($1, $2, $3)
             RETURNING id`,
            [tipo, titulo, descricao]
        );

        const documentoId = result.rows[0].id;
        let encarregados = new Set();

        if (enviarParaTodos) {
            const encResult = await pool.query(`SELECT id FROM encarregados`);
            encResult.rows.forEach(row => encarregados.add(row.id));

            await pool.query(
                `INSERT INTO documentos_categorias (documento_id, curso, classe, turma)
                 VALUES ($1, NULL, NULL, NULL)`,
                [documentoId]
            );
        } else {
            const insertCategoriaQuery = `
                INSERT INTO documentos_categorias (documento_id, curso, classe, turma)
                VALUES ($1, $2, $3, $4)
            `;

            for (const espec of especificacoes) {
                const { curso, classe, turma } = espec;

                await pool.query(insertCategoriaQuery, [
                    documentoId,
                    curso || null,
                    classe || null,
                    turma !== 'todos' ? turma : null
                ]);

                const query = `
                    SELECT DISTINCT e.id
                    FROM encarregados e
                    JOIN estudantes s ON e.id = s.encarregado_id
                    WHERE s.classe = $1
                      ${curso ? `AND s.curso = $2` : ''}
                      ${turma && turma !== 'todos' ? `AND s.turma = $3` : ''}
                `;

                const params = [classe];
                if (curso) params.push(curso);
                if (turma && turma !== 'todos') params.push(turma);

                const res = await pool.query(query, params);
                res.rows.forEach(r => encarregados.add(r.id));
            }
        }

        for (const encarregadoId of encarregados) {
            await pool.query(
                `INSERT INTO assinaturas_documento (documento_id, encarregado_id)
                 VALUES ($1, $2)
                 ON CONFLICT DO NOTHING`,
                [documentoId, encarregadoId]
            );
        }

        return documentoId;
    } catch (err) {
        console.error('Erro ao guardar documento:', err);
        throw err;
    }
};

module.exports = {
    findEmail,
    deleteVerificationCode,
    saveVerificationCode,
    verifyVerificationCode,
    getLogEvents,
    estudanteExiste,
    buscarEncarregadoPorEmail,
    buscarEncarregadoPorCampo,
    criarEncarregado,
    cadastrarEstudanteNoBanco,
    gerarTokenRedefinicao,
    buscarToken,
    adicionar_senha,
    deletarToken,
    logEvent,
    buscaridestudante,
    enviar_codigo,
    buscar_codigoOTP,
    atualizar_login_coordenacao,
    find_cordenacao,
    buscar_logs,
    lista_encarregados,
    lista_estudantes,
    lista_coordenacao,
    atualizarEncarregado,
    atualizar_estudante ,
    verifica_encarregado,
    verifica_estudante,
    eliminar_tudo,
    buscar_role,
    buscar_encarregado_id,
    buscar_estudantes_associados,
    log_atividades,
    guardar_documento_e_enviar
};