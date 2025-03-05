module.exports = (req, res, next) => {
    let body = '';

    const validateRequest = (req, res, next) => {
        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({ message: "O corpo da requisição deve ser um JSON válido." });
        }
    
        const { email, codigo } = req.body;
    
        if (!email || !codigo) {
            return res.status(400).json({ message: "Email e código são obrigatórios." });
        }
    
        next();
    };    
};
