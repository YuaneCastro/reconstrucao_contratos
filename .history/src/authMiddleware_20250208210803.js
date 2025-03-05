const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateToken(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).send('Token não fornecido');
    }

     try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
}

module.exports = authenticateToken;