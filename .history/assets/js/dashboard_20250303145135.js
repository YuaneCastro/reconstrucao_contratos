function logout() {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/login"; // Redireciona para a página de login
}
exports.getUserData = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Não autorizado" });
        }

        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const user = await findUserByEmail(decoded.email);

        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        res.json({ nome: user.nome, email: user.email });

    } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
        res.status(500).json({ message: "Erro no servidor" });
    }
};
