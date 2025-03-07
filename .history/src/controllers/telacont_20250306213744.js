const jwt = require("jsonwebtoken"); 
const { findUserByEmail, } = require('../db');

const getUserFromToken = async (req) => {
    try {
        const token = req.cookies.token;
        if (!token) return null;

        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const email = decoded.email;

        const user = await findUserByEmail(email);
        return user || null;
    } catch (error) {
        console.error("Erro ao validar token:", error);
        return null;
    }
};

exports.showtelap = async (req, res) => { 
    try {
        const user = await getUserFromToken(req);
        if (!user) return res.redirect("/login");

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
exports.delete = async(req, res) => {

};
exports.paginaConfiguracoes = async(req, res) => {
    const user = await getUserFromToken(req);
    if (!user) return res.redirect("/login");
   
    const { username, email } = req.body;
    if (!username || !email) {
        return res.status(400).json({ mensagem: "Preencha todos os campos." });
    }
    if (!username || !email) {
            return res.status(400).json({ mensagem: "Preencha todos os campos." });
        }

}