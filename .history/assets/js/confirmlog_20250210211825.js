fetch("/confirmacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "usuario@email.com" }) // Enviar os dados para gerar o token
})
    .then(response => response.json())
    .then(data => {
        localStorage.setItem("token", data.token); // 🔑 Salvar token no localStorage
        window.location.href = "/dashboard"; // 🔄 Redirecionar para a dashboard
    })
    .catch(error => console.error("Erro ao confirmar:", error));

