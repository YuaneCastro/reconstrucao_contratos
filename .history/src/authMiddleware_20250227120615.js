const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'sua_chave_secreta';

function authenticateToken(req, res, next) {
    const token = req.cookies.token; // Pegamos o token do cookie

    if (!token) {
        return res.status(403).json({ message: "Acesso negado. Faça login novamente." });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Token inválido ou expirado." });
        }

        req.user = user; // Adicionamos os dados do usuário ao request
        next();
    });
}

module.exports = authenticateToken;