const express = require('express');
const router = express.Router();
const telapCont = require('../controllers/telacont');
const verifyToken = require('../authMiddleware');

function authenticateToken(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).send('Token não fornecido');
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send('Token inválido');
        }
        req.user = user; // Adiciona o usuário decodificado ao objeto req
        next();
    });
}

router.get('/dashboard', verifyToken, telapCont.showtelap);
router.get('/logout', telapCont.logout);

router.post('/delete', telapCont.delete);
router.post("/atualizar-informacoes", telapCont.paginaConfiguracoes);

module.exports = router;
