const pool = require('../db'); // Importa a instância do pool de conexões

exports.showtelap = async(req, res) => {
    try {
        const email = req.user.email; // Obtendo o email do usuário autenticado

        // Buscar informações do usuário no banco de dados
        const result = await pool.query("SELECT nome, email, data_criacao FROM usuarios WHERE email = $1", [email]);

        if (result.rows.length === 0) {
            return res.status(404).send("Usuário não encontrado.");
        }

        const user = result.rows[0];

        // Renderiza o dashboard enviando os dados corretos
        res.render("dashboard", { 
            nome: user.nome, 
            email: user.email, 
            dataCriacao: user.data_criacao // 🔹 Agora `dataCriacao` é enviada para o EJS
        });

    } catch (error) {
        console.error("Erro ao carregar o dashboard:", error);
        res.status(500).send("Erro interno do servidor.");
    }
};

