const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function authenticateToken(req, res, next) {
    let token = req.cookies.token || req.headers['authorization'];

    if (!token) return res.status(401).json({ message: 'Acesso negado. Faça login.' });

    // Caso o token esteja no cabeçalho como "Bearer TOKEN"
    if (token.startsWith("Bearer ")) {
        token = token.split(" ")[1]; // Pegamos apenas o token
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token inválido ou expirado.' });
        req.user = user;
        next();
    });
};
