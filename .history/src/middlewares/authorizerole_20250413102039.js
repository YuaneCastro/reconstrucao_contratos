function authorizeRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.redirect("/Telaerro");
        }
        next();  // Permite o acesso se o papel for válido
    };
}

module.exports = authorizeRole;