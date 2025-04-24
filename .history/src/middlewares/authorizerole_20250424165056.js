function authorizeRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            const message = "bom dia";
            return res.redirect("/Telaerro?message=" + encodeURIComponent(message));

            return res.redirect("/Telaerro");
        }
        next();  // Permite o acesso se o papel for válido
    };
}

module.exports = authorizeRole;