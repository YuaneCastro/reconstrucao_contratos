const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function authenticateToken(req, res, next) {
     const token = req.cookies.token; // Pegando o token dos cookies

    if (!token) {
        return res.redirect('/login'); // Se não tiver token, manda pro login
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.redirect('/login'); // Se for inválido, redireciona também
        }
        
        req.user = user; // Armazena os dados do usuário na requisição
        next(); // Permite que a requisição continue para a rota protegida
    });
};
