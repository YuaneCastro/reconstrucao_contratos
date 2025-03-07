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
exports.delete = async(req, res) => {

};
exports.paginaConfiguracoes = async(req, res) => {
    const token = req.cookies.token;
    if (!token) {return res.redirect('/login')};

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const userId = decoded.id;
    const { nome, email, senha } = req.body;

    const senhaHash = senha ? await bcrypt.hash(senha, 10) : null;
        const resultado = await updateUser(userId, nome, email, senhaHash);

    const user = await findUserByEmail(email);
    if (!user) {
        return res.redirect('/login');
    }
}