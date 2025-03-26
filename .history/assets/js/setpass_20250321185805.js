document.addEventListener("DOMContentLoaded", function () {
    const token = window.location.pathname.split("/").pop(); // Obtém o token da URL

    document.getElementById("passwordForm").addEventListener("submit", async function (event) {
        event.preventDefault(); // Evita o reload da página

        const senha = document.getElementById("senha").value;

        const response = await fetch(`/set-password/${token}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ senha })
        });

        const message = await response.text();
        alert(message);

        if (response.ok) {
            window.location.href = "/login"; // Redireciona para o login
        }
    });
});