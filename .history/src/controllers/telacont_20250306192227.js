const jwt = require("jsonwebtoken"); 
const { findUserByEmail } = require('../db');

exports.showtelap = async (req, res) => { 
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.redirect("/login");
        }

        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const email = decoded.email;

        // Aqui você precisa buscar os dados do usuário no banco
        const user = await findUserByEmail(email); // Verifique se essa função existe

        if (!user) {
            return res.redirect("/login");
        }

        res.render("dashboard", {
            nome: user.nome,
            email: user.email,
            dataCriacao: user.dataCriacao,
        });
    } catch (error) {
        console.error("Erro ao carregar a dashboard:", error);
        res.redirect("/login");
    }
};
exports.logout = (req, res)=>{
    res.clearCookie("tempToken");
    res.clearCookie("token"); 
    res.redirect('/login');
};
exports.delete = async(req, res)=>{
    
};