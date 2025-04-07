const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    const token = req.cookies.token; // Obtém o token dos cookies

    if (!token) {
        return res.redirect("/Telaerro"); // 🔥 Adicionando "return" para evitar erro
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.redirect("/Telaerro"); // 🔥 Aqui também precisa do "return"
        }
        req.user = user; // Adiciona o usuário decodificado ao objeto req
        next();
    });
}
function authorizeRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Acesso negado" });
        }
        next();
    };
}
module.exports = authenticateToken;
