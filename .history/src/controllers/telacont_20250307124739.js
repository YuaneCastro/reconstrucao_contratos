const jwt = require("jsonwebtoken"); 
const { findUserByEmail } = require('../db');


exports.showtelap = async (req, res) => { 
    try {
        const token = req.cookies.token;
        if (!token) {return res.redirect("/login")};
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const email = decoded.email;
        const user = await findUserByEmail(email); // Verifique se essa função existe

        if (!user) {return res.redirect("/login")}

        res.render("dashboard", {
            nome: user.nome,
            email: user.email,
        });
    } catch (error) {
        console.error("Erro ao carregar a dashboard:", error);
        res.redirect("/login");
    }
};
exports.logout = (req, res) => {
    res.clearCookie("tempToken");
    res.clearCookie("token"); 
    res.redirect('/login');
};
exports.delete = async (req, res) => {

};

exports.paginaConfiguracoes = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.redirect('/login');
        }

        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const email = decoded.email;
        const user = await getUserByEmail(email);
        
        if (!user) {
            return res.redirect('/login');
        }
        res.render('atualizar-informacoes', { user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao carregar a página de atualização de informações');
    }
};

exports.atualizarUsuario = async (req,res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ error: 'Usuário não autenticado' });
        }

        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const userId = decoded.id;
        const { nome, email, senha } = req.body;

        const senhaHash = senha ? await bcrypt.hash(senha, 10) : null;
        await updateUser(userId, nome, email, senhaHash);

        // Pegamos os dados atualizados do usuário e renderizamos a página novamente
        const user = await getUserByEmail(email || decoded.email);

        return res.render('atualizar-informacoes', { user, sucesso: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
};