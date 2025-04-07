function authorizeRole(...allowedRoles) {
    return (req, res, next) => {
        console.log("User role:", req.user?.role); // Verifique o valor do role aqui
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Acesso negado" });
        }
        next();
    };
}

module.exports = authorizeRole;