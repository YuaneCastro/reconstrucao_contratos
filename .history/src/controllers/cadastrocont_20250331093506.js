const { buscarEncarregadoPorCampo, buscaridestudante,logEvent,buscarToken, adicionar_senha, deletarToken, estudanteExiste, criarEncarregado, gerarTokenRedefinicao, cadastrarEstudanteNoBanco } = require('../db');
const nodemailer = require('nodemailer');

exports.telacadastro = (req, res) => {
    res.render('cadastro/cadastro');
};
exports.telapass = async (req, res) =>{
    res.render('cadastro/setPassword');
};

exports.cadastrar = async (req, res) => {
    const { nome, data_nascimento, classe, turma, curso, encarregado_nome, encarregado_email, telefone } = req.body;

    try {

        if (await estudanteExiste(nome)) {
            return res.status(400).json({ sucesso: false, motivo: "estudante_existente" });
        }

        const nomeExiste = await buscarEncarregadoPorCampo('nome', encarregado_nome);
        const emailExiste = await buscarEncarregadoPorCampo('email', encarregado_email);
        const telefoneExiste = await buscarEncarregadoPorCampo('telefone', telefone);
        console.log('Dados encontrados:', { nomeExiste, emailExiste, telefoneExiste });
        console.log('vai analisar')
        let idsEncontrados = new Set();
        if (nomeExiste && nomeExiste.length > 0) idsEncontrados.add(nomeExiste[0].id);
        if (emailExiste && emailExiste.length > 0) idsEncontrados.add(emailExiste[0].id);
        if (telefoneExiste && telefoneExiste.length > 0) idsEncontrados.add(telefoneExiste[0].id);
        console.log('IDs encontrados:', [...idsEncontrados]);
        console.log('vai sair agora')
        if (idsEncontrados.size > 1 || idsEncontrados.size === 1 && (nomeExiste.length === 0 || emailExiste.length === 0 || telefoneExiste.length === 0)) {
            console.log('Conflito de encarregado detectado.');
            return res.status(400).json({
                sucesso: false,
                motivo: "encarregado_conflito"
            });
        }
        console.log('resultado saiu')
        let encarregadoId;

        if (idsEncontrados.size === 1) {
            // Encarregado já existe corretamente
            encarregadoId = [...idsEncontrados][0];
            
        } else {
            // Encarregado novo → cadastra normalmente
            const encarregadoId = await criarEncarregado(encarregado_nome, encarregado_email, telefone);
            await logEvent(encarregadoId, null, "Cadastro", `Usuário ${encarregado_nome} foi cadastrado`);
            
            const token = await gerarTokenRedefinicao(encarregadoId);
            const resetLink = `http://localhost:3000/set-password/${token}`;
        
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
                    <p><a href="${resetLink}">Clique aqui para definir sua senha</a></p>`
            });
        
            await cadastrarEstudanteNoBanco(nome, data_nascimento, classe, turma, curso, encarregadoId);
            const estudante = await buscaridestudante(nome);
            await logEvent(encarregadoId, estudante.id, "Cadastro", `Estudante: ${nome} foi cadastrado por: ${encarregado_nome}`);
        
            res.status(200).json({
                sucesso: true,
                motivo: "cadastro_sucesso"
            });         
        }        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            sucesso: false,
            motivo: "erro_interno"
        });
    }
};
exports.setPassword = async (req, res) => {
    const { token } = req.params;
    const { senha } = req.body;
    try {
        const tokenData = await buscarToken(token);
        if (!tokenData) {
            return res.status(400).send('Token inválido ou expirado.');
        }

        const { encarregado_id, expiracao } = tokenData;

        if (new Date() > expiracao) {
            return res.status(400).send('Token expirado.');
        }

        await adicionar_senha(encarregado_id, senha);
        await deletarToken(token);

        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao definir senha.');
    }
};
