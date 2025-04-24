function authorizeRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            const message = "message=Você precisa fazer login para acessar esta página.";
            return res.redirect("/Telaerro?message=" + encodeURIComponent(message));
        }
        next();  // Permite o acesso se o papel for válido
    };
}

module.exports = authorizeRole;