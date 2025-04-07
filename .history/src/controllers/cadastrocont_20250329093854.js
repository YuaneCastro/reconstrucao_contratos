const { encarregado_existe,buscaridestudante,logEvent,buscarToken, adicionar_senha, deletarToken, estudanteExiste, criarEncarregado, gerarTokenRedefinicao, cadastrarEstudanteNoBanco } = require('../db');
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
            return res.status(400).send('Este estudante já foi cadastrado.');
        }
        const encarregado = await encarregado_existe
        if (encarregado.rows.length > 0) {
            const encarregadoId = encarregado.rows[0].id;
            await cadastrarEstudanteNoBanco(nome, data_nascimento, classe, turma, curso, encarregadoId);
            const estudante = await buscaridestudante(nome);
            await logEvent(encarregadoId, estudante.id, "Cadastro", `Estudante: ${nome} foi cadastrado por: ${encarregado_nome}`);
          
            return res.json({ sucesso: true });
          }else {
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
        
            return res.json({ sucesso: true });
        }        
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao cadastrar estudante.');
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
