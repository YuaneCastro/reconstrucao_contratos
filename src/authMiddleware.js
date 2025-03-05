const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    const token = req.cookies.token;
    
    if (!token) {
        return res.redirect("/login"); // Redireciona caso não esteja autenticado
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Erro na autenticação:", error);
        res.clearCookie("token");
        res.redirect("/login");
    }
};
