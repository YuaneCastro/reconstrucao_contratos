const {estudanteExiste, buscarEncarregadoPorEmail, criarEncarregado, gerarTokenRedefinicao, enviarEmailRedefinicao, cadastrarEstudanteNoBanco } = require('../db');

exports.telacadastro = (req, res) => {
    res.render('cadastro');
};

exports.cadastrar = async (req, res) => {
    const { nome, data_nascimento, classe, turma, curso, encarregado_nome, encarregado_email, telefone } = req.body;

    try {
        if (await estudanteExiste(nome)) {
            return res.status(400).send('este estudante ja foi cadastrado.');
        }

        let encarregado = await buscarEncarregadoPorEmail(encarregado_email);
        let encarregadoId;

         if (encarregado) {
            encarregadoId = encarregado.id;
        } else {
            // Cria o encarregado e gera um token de redefinição de senha
            encarregadoId = await criarEncarregado(encarregado_nome, encarregado_email, telefone);
            const token = await gerarTokenRedefinicao(encarregadoId);
            const resetLink = `http://localhost:3000/set-password/${token}`;
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Defina sua senha para acessar o sistema',
                html: `<p>Olá ${nome},</p>
                    <p>Você foi cadastrado como encarregado de um estudante. Defina sua senha para acessar o sistema.</p>
                    <p><a href="${resetLink}">Clique aqui para definir sua senha</a></p>`
            });
        }
        await cadastrarEstudanteNoBanco(nome, data_nascimento, classe, turma, curso, encarregadoId);
        res.status(201).send('Estudante cadastrado e e-mail enviado ao encarregado.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao cadastrar estudante.');
    }
};
