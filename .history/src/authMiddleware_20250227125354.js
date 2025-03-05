const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function authenticateToken(req, res, next) {
    const token = req.cookies.token || req.headers['authorization']; 

    if (!token) {
        return res.status(401).json({ message: 'Acesso negado. Faça login.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido ou expirado.' });
        }
        req.user = user;
        next();
    });
};
