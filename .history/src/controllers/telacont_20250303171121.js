const jwt = require("jsonwebtoken"); 


exports.showtelap =async (req, res) => { 
     try {
    // Pegando o token do cookie
    const token = req.cookies.token;
    if (!token) {
        return res.redirect("/login"); // Redireciona para login se não houver token
    }

    // Decodificando o token para obter o email do usuário
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const email = decoded.email;

    // Buscando o usuário no banco de dados
    const user = await User.findOne({ where: { email } });
    if (!user) {
        return res.redirect("/login");
    }

    // Renderizando a dashboard com os dados do usuário
    res.render("dashboard", {
        nome: user.nome,
        email: user.email,
        dataCriacao: user.createdAt.toLocaleDateString("pt-BR"),
    });
} catch (error) {
    console.error("Erro ao carregar a dashboard:", error);
    res.status(500).send("Erro interno no servidor");
}
};
