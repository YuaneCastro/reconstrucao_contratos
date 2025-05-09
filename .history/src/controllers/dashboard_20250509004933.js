const jwt = require("jsonwebtoken"); 
const { buscar_documentos_nao_emitidos, assinarContrato, verificarAssinatura, getContratoPorId, buscarContratosPendentes, buscar_documento_contrato, buscar_documento_comunicado, buscarDocumentosDoEncarregado, enviar_documento, guardar_documento, log_atividades, buscar_estudantes_associados, gerarTokenRedefinicao, deletarToken, buscar_encarregado_id, eliminar_tudo, verifica_estudante, atualizarEncarregado, atualizar_estudante, lista_coordenacao, lista_encarregados ,lista_estudantes, findEmail, buscar_logs, find_cordenacao } = require('../db');
const nodemailer = require('nodemailer');



exports.telaerror = async (req,res) => {
    const message = req.query.message;
    res.render('dashboard/Telaerro', { message });
};

//------------------coordenacao-------------------

exports.dashboard_cordenacao = async(req,res) =>{
    try {
        const token = req.cookies.token;
        if (!token) {return res.redirect("/login-cordenacao")};

        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const id = decoded.id;

        const user = await find_cordenacao(id); // Verifique se essa função existe
        if (!user) {return res.redirect("/login-cordenacao")};

        const logs = await buscar_logs();
        const encarregados = await lista_encarregados();
        const estudantes = await lista_estudantes();
        const coordenacao = await lista_coordenacao();
        const contrato = await buscar_documento_contrato();
        const comunicado = await buscar_documento_comunicado();
        const documentos = await buscar_documentos_nao_emitidos();
        res.render("dashboard/dashboard-cordenacao", { email: user.email, logs, encarregados, estudantes, coordenacao, comunicado, contrato, documentos});
    } catch (error) {
        console.error("Erro ao carregar a dashboard:", error);
        return res.redirect("/Telaerro?message=" + encodeURIComponent("Precisa fazer login para acassar esta tela."));

    }
};
exports.update_Student = async (req, res) => {
    const { id, nome, classe, turma, curso } = req.body;
    try{
        const estudanteExistente = await verifica_estudante(nome, id);
        
        if (estudanteExistente.length > 0) {
            return res.status(400).json({
                sucesso: false,
                motivo: "Já existe um estudante com esse nome."
            });
        }
        await atualizar_estudante(id, nome, classe, turma, curso);
        return res.status(200).json({
            sucesso: true,
            motivo: "atualizado com sucesso"
        });
    }catch(error){
        console.error('Erro ao atualizar estudante:', error);
        return res.status(500).json({
            sucesso: false,
            motivo: "error ao atualizar"
        });
    }
};
exports.update_encarregado = async (req, res) => {
    const { nome, email, telefone, id } = req.body;

    const resultado = await atualizarEncarregado(nome, email, telefone, id); // Chama o método para atualizar o encarregado
    
    return res.status(200).json(resultado); // Retorna o resultado para o frontend
};
exports.deletar = async(req, res) =>{
    const {id} = req.body;
    try{
        const resultado = await eliminar_tudo(id);
        return res.status(200).json(resultado);
    }catch(err){
        console.log(err);
    }
    
};
exports.redifinir_senha = async(req, res) => {
    const {id} = req.body;
    const encarregadoId = id;
    await deletarToken(encarregadoId);
    const encarregado = await buscar_encarregado_id(encarregadoId);
    const token = await gerarTokenRedefinicao(encarregadoId);
    const resetLink = `https://reconstrucaocontratos-production.up.railway.app/set-password/${token}`;
    console.log(resetLink);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: encarregado.email,
        subject: 'Defina sua senha para acessar o sistema',
        html: `<p>Olá ${encarregado.nome},</p>
            <p>Redefina sua senha para acessar o sistema.</p>
            <p><a href="${resetLink}" target="_blank">Clique aqui para definir sua senha</a></p>`
    });
    return res.status(200).json({
        sucesso: true,
        motivo: "link de confirmacao enviado com sucesso"
    });
};
exports.enviar_documento = async (req, res) => {
    const dadosContrato = req.body; // Pega os dados enviados no corpo da requisição
    try{
        await enviar_documento(dadosContrato.tipoDocumento, dadosContrato.titulo, dadosContrato.conteudo,  dadosContrato.especificacoes, dadosContrato.enviarTodos, dadosContrato.dataExpiracao, dadosContrato.id);
        return res.status(200).json({
            sucesso: true,
            motivo: "documento enviado com sucesso."
        });
    }catch(err){
        console.log(err)
        return res.status(500).json({
            sucesso: false,
            motivo: "Erro interno ao enviar o documento."
        });
    }
};
exports.guardar_documentos = async(req, res) =>{
    const dadosContrato = req.body;
    try{
        await guardar_documento (dadosContrato.tipoDocumento, dadosContrato.titulo, dadosContrato.conteudo,  dadosContrato.especificacoes, dadosContrato.enviarParaTodos, dadosContrato.dataExpiracao, dadosContrato.id)
        
        return res.status(200).json({
            sucesso: true,
            motivo: "Documento salvo com sucesso."
        });
    }catch(err){
        console.log(err)
        return res.status(500).json({
            sucesso: false,
            motivo: "Erro interno ao guardar o documento."
        });
    }
};


//------------------encarregados--------------------
exports.showtelap = async (req, res) => { 
    try {
        const token = req.cookies.token;
        if (!token) {return res.redirect("/login-cordenacao")};

        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const email = decoded.email;
        const user = await findEmail(email)
        const nome = user.nome;
        const id = user.id;

        const estudantes = await buscar_estudantes_associados(id);
        const log_atividade = await log_atividades(id);
        const documentos = await buscarDocumentosDoEncarregado(id);
        const documentos_pendentes = await buscarContratosPendentes(id);
        //console.log(documentos_pendentes)
        res.render("dashboard/dashboard",{email, nome, id, estudantes, log_atividade, documentos, documentos_pendentes});
    } catch (error) {
        console.log(error);
        return res.redirect("/Telaerro?message=" + encodeURIComponent("Precisa fazer login para acassar esta tela."));
    }
};
exports.buscar_documento = async (req, res) => {
    const id = req.params.id;
    const contrato = await getContratoPorId(id); // Substitua com sua função real
    if (contrato) {
      res.json({ conteudo: contrato.conteudo }); // "conteudo" deve ser uma coluna no banco
    } else {
      res.status(404).json({ erro: 'Contrato não encontrado' });
    }
};
exports.assinar_contrato = async (req, res) => {
    const { assinatura_doc_id, encarregado_id, estudante_id } = req.body;
    const formatIP = (ip) => {
        return ip === "::1" ? "127.0.0.1" : ip;
      };
      const ip_user = formatIP(
        req.headers["x-forwarded-for"]?.split(",")[0] ||
        req.socket?.remoteAddress ||
        req.connection?.remoteAddress ||
        req.ip
      );
    try{
        const result = await verificarAssinatura(assinatura_doc_id, encarregado_id, estudante_id);
        if (!result) {
            return res.status(400).json({ sucesso: false, motivo: 'Dados não conferem. Assinatura inválida.' });
        }
        await assinarContrato(assinatura_doc_id, ip_user);
        return res.json({ sucesso: true, motivo: 'Contrato assinado com sucesso!' });
    }catch(err){
        console.log(err);
        return res.status(500).json({ sucesso: false, motivo: 'Erro interno ao assinar o contrato.' });
    }
};