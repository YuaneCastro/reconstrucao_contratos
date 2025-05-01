const { buscarEncarregadoPorCampo, buscaridestudante,logEvent,buscarToken, adicionar_senha, deletarToken, estudanteExiste, criarEncarregado, gerarTokenRedefinicao, cadastrarEstudanteNoBanco } = require('../db');
const nodemailer = require('nodemailer');


exports.telapass = async (req, res) =>{
    const { token } = req.params;
    const tokenData = await buscarToken(token);
    if (!tokenData) {
        const message = "O tempo disponível para a redefinição de senha de Sneha foi encerrado. Para solicitar uma nova oportunidade de redefinir a senha, por favor, entre em contacto com a instituição através de um dos seguintes meios: Telefone: +244 999 999 999, E-mail: apoio@instituicao.co.ao, Localização: Rua da Liberdade, nº 45, Luanda — Angola.";
        return res.redirect("/Telaerro?message=" + encodeURIComponent(message));
    }
    res.render('cadastro/setPassword');
};

exports.cadastrar = async (req, res) => {
    const { nome, data_nascimento, classe, turma, curso2, encarregado_nome, encarregado_email, telefone } = req.body;

    try {
        if (await estudanteExiste(nome)) {
            return res.status(400).json({ sucesso: false, motivo: "estudante_existente" });
        }

        const nomeExiste = await buscarEncarregadoPorCampo('nome', encarregado_nome);
        const emailExiste = await buscarEncarregadoPorCampo('email', encarregado_email);
        const telefoneExiste = await buscarEncarregadoPorCampo('telefone', telefone);
        //console.log('Dados encontrados:', { nomeExiste, emailExiste, telefoneExiste });
        //console.log('vai analisar')
        let idsEncontrados = new Set();
        if (nomeExiste && nomeExiste.length > 0) idsEncontrados.add(nomeExiste[0].id);
        if (emailExiste && emailExiste.length > 0) idsEncontrados.add(emailExiste[0].id);
        if (telefoneExiste && telefoneExiste.length > 0) idsEncontrados.add(telefoneExiste[0].id);
        if (idsEncontrados.size > 1 || idsEncontrados.size === 1 && (nomeExiste.length === 0 || emailExiste.length === 0 || telefoneExiste.length === 0)) {
            //console.log('Conflito de encarregado detectado.');
            return res.status(400).json({
                sucesso: false,
                motivo: "encarregado_conflito"
            });
        }
        let encarregadoId;
        if (idsEncontrados.size === 1) {
            // Encarregado já existe corretamente
            encarregadoId = [...idsEncontrados][0];
            //console.log(`Encarregado já cadastrado. ID: ${encarregadoId}`);
        } else {
            // Encarregado novo → cadastra normalmente
            encarregadoId = await criarEncarregado(encarregado_nome, encarregado_email, telefone);
            //console.log(`Novo encarregado cadastrado. ID: ${encarregadoId}`);

            await logEvent(encarregadoId, null, "Cadastro", `Usuário ${encarregado_nome} foi cadastrado`);
            
            const token = await gerarTokenRedefinicao(encarregadoId);
            const resetLink = `https://reconstrucaocontratos-production.up.railway.app/set-password/${token}`;
        
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });
        
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: encarregado_email,
                subject: 'Defina sua senha para acessar o sistema',
                html: `<p>Olá ${encarregado_nome},</p>
                    <p>Você foi cadastrado como encarregado de um estudante. Defina sua senha para acessar o sistema.</p>
                    <p><a href="${resetLink}" target="_blank">Clique aqui para definir sua senha</a>                    </p>`
            });
        }    
        // se o encarregado ja existir
        await cadastrarEstudanteNoBanco(nome, data_nascimento, classe, turma, curso2, encarregadoId);
        //console.log(`Estudante ${nome} cadastrado com sucesso.`);

        const estudante = await buscaridestudante(nome);  
        await logEvent(encarregadoId, estudante.id, "Cadastro", `Estudante: ${nome} foi cadastrado por: ${encarregado_nome}`);  
        return res.status(200).json({
            sucesso: true,
            motivo: "cadastro_sucesso"
        });
    } catch (error) {
        console.error('Erro ao cadastrar estudante:', error);

        // Evita enviar resposta duplicada
        if (!res.headersSent) {
            return res.status(500).json({
                sucesso: false,
                motivo: "erro_servidor"
            });
        }
    }
};
exports.setPassword = async (req, res) => {
    const { token } = req.params;
    const { senha } = req.body;

    console.log("Token recebido:", token); // Log para verificar o token recebido

    try {
        // Verificando o token
        const tokenData = await buscarToken(token);
        if (!tokenData) {
            console.error("Token inválido ou expirado.");
            return res.status(400).send('Token inválido ou expirado.');
        }

        const { encarregado_id, expiracao } = tokenData;
        console.log("Token encontrado:", tokenData); // Log para verificar os dados do token

        // Verificando se o token expirou
        if (new Date().getTime() > new Date(expiracao).getTime()) {
            console.error("Token expirado.");
            return res.status(400).send('O token expirou. Por favor, entre em contato com a coordenação para redefinir sua senha.');
        }        

        // Tentando adicionar a senha
        //console.log("Adicionando a senha...");
        const role = "encarregado";
        await adicionar_senha(encarregado_id, senha, role);
        //console.log("Senha adicionada com sucesso.");

        // Deletando o token
        await deletarToken(encarregado_id);
        //console.log("Token deletado.");

        // Redirecionando para login
        res.redirect('/login');
    } catch (error) {
        console.error("Erro ao redefinir senha:", error);
        res.status(500).send('Erro ao definir senha.');
    }
};