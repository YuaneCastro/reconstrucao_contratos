const jwt = require("jsonwebtoken"); 
const { findEmail, updateUser, deleteUser, getLogEvents } = require('../db');
const bcrypt = require('bcrypt');

exports.showtelap = async (req, res) => { 
    try {
        const token = req.cookies.token;
        if (!token) {return res.redirect("login/login")};
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const email = decoded.email;
        const user = await findEmail(email); // Verifique se essa função existe

        if (!user) {return res.redirect("login/login")}
        const logs = await getLogEvents(user.id);

        res.render("dashboard/dashboard", {
            nome: user.nome,
            email: user.email,
            logs
        });
    } catch (error) {
        console.error("Erro ao carregar a dashboard:", error);
        res.redirect("login/login");
    }
};
exports.paginaConfiguracoes = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {return res.redirect('/login')}

        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const email = decoded.email;
        const user = await findUserByEmail(email);
        
        if (!user) {return res.redirect('/login');}
        res.render('dashboard/atualizar-informacoes', { user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao carregar a página de atualização de informações');
    }
};
exports.outras_operacoes = async(req, res) =>{
    try {
        const token = req.cookies.token;
        if (!token) {return res.redirect('/login');}

        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const email = decoded.email;
        const user = await findUserByEmail(email);
        
        if (!user) {return res.redirect('/login')}
        res.render('dashboard/outras_operacoes', { user });
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
        if(!token){return res.status(401).json({ error: 'Usuário não autenticado' });}
        
        // Decodifica o token para obter o ID do usuário
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const email = decoded.email;
        const user = await findUserByEmail(email);
        const id= user.id;

        await deleteUser(id);
        res.clearCookie('token');
        res.redirect('/login');

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message || 'Erro ao atualizar usuário' });
    }
};
exports.atualizarUsuario = async (req, res) => {
    try {
        // Verifica se o token está presente
        const token = req.cookies.token;
        if (!token) {return res.status(401).json({ error: 'Usuário não autenticado' });}

        // Decodifica o token para obter o ID do usuário
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const email = decoded.email;
        const user = await findUserByEmail(email);

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