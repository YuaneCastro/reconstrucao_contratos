const jwt = require('jsonwebtoken');
const SECRET_KEY = 'sua_chave_secreta';

module.exports = function verifyToken(req, res, next) {
    const token = req.cookies.auth_token;

    if (!token) {
        return res.status(403).json({ message: 'Acesso negado. Faça login novamente.' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token inválido ou expirado' });
    }
};