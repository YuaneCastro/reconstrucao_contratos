const jwt = require("jsonwebtoken"); 
const { eliminar_tudo, verifica_estudante, atualizarEncarregado, atualizar_estudante, lista_coordenacao, lista_encarregados ,lista_estudantes, findEmail, buscar_logs, find_cordenacao } = require('../db');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

exports.showtelap = async (req, res) => { 
    try {

        res.render("dashboard/dashboard");

    } catch (error) {
        console.error("Erro ao carregar a dashboard:", error);
        res.redirect("/login");
    }
};
exports.paginaConfiguracoes = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {return res.redirect('/Telaerro')}

        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const email = decoded.email;
        const user = await findEmail(email);
        
        if (!user) {return res.redirect('/Telaerro')}
        res.render('dashboard/atualizar-informacoes', { user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao carregar a página de atualização de informações');
    }
};


exports.logout = (req, res) => {
    res.clearCookie("tempToken");
    res.clearCookie("token"); 
    res.redirect('/login');
};
exports.delete = async (req, res) => {
   try {
        const token= req.cookies.token;
        if(!token){return res.redirect('/Telaerro')}
        
        // Decodifica o token para obter o ID do usuário
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const email = decoded.email;
        const user = await findEmail(email);
        const id= user.id;

        await deleteUser(id);
        res.clearCookie('token');
        res.redirect("/login");

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message || 'Erro ao atualizar usuário' });
    }
};
exports.atualizarUsuario = async (req, res) => {
    try {
        // Verifica se o token está presente
        const token = req.cookies.token;
        if (!token) {return res.redirect('/Telaerro')}

        // Decodifica o token para obter o ID do usuário
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const email = decoded.email;
        const user = await findEmail(email);

        const id = user.id;
        const { nome, N_email, senha } = req.body;

        // Criptografa a senha, se for fornecida
        let senhaHash = null;
        if (senha) {
            const salt = await bcrypt.genSalt(10);
            senhaHash = await bcrypt.hash(senha, salt);
        }

        // Atualiza o usuário no banco de dados
        await updateUser(id, nome, N_email, senhaHash);

        // Limpa o cookie e redireciona para o login
        res.clearCookie('token');
        return res.redirect('/login');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message || 'Erro ao atualizar usuário' });
    }
};

exports.dashboard_cordenacao = async(req,res) =>{
    try {
        const token = req.cookies.token;
        if (!token) {return res.redirect("/login")};

        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const id = decoded.id;

        const user = await find_cordenacao(id); // Verifique se essa função existe
        if (!user) {return res.redirect("/login")}

        const logs = await buscar_logs();
        const encarregados = await lista_encarregados();
        const estudantes = await lista_estudantes();
        const coordenacao = await lista_coordenacao();

        res.render("dashboard/dashboard-cordenacao", { email: user.email, logs, encarregados, estudantes, coordenacao});
    } catch (error) {
        console.error("Erro ao carregar a dashboard:", error);
        res.redirect('/Telaerro')
    }
};
exports.telaerror = async (req,res) => {
    res.render('dashboard/Telaerro')
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
    const encarregado = await throw error;
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

}
