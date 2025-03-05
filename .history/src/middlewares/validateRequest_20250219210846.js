module.exports = (req, res, next) => {
    let body = '';

    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            req.body = JSON.parse(body || '{}'); // Garante que sempre tenha um objeto
        } catch (error) {
            return res.status(400).json({ message: "Erro ao processar JSON" });
        }

        if (!req.body.email || !req.body.codigo) {
            return res.status(400).json({ message: "Email e código são obrigatórios." });
        }

        next();
    });
};
