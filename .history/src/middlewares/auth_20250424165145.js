const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    const token = req.cookies.token; // Obtém o token dos cookies

    if (!token) {
        return res.redirect("/Telaerro?message=");
        const message = "Você precisa fazer login para acessar esta página.";
            return res.redirect("/Telaerro?message=" + encodeURIComponent(message)); // 🔥 Adicionando "return" para evitar erro
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.redirect("/Telaerro?message=Sua sessão expirou. Faça login novamente."); // 🔥 Aqui também precisa do "return"
        }
        req.user = user; // Adiciona o usuário decodificado ao objeto req
        next();
    });
}
module.exports = authenticateToken;