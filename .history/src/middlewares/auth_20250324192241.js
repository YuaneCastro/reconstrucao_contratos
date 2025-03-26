const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const token = req.cookies.token; // Obtém o token dos cookies

    if (!token) {
        return res.status(401).json({ error: 'Acesso negado. Faça login para continuar.' });
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
            res.redirect('Telaerro')
        }
        req.user = user; // Adiciona o usuário decodificado ao objeto req
        next();
    });
}

module.exports = authenticateToken;
