document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const senha = document.getElementById("password").value;
    const button = document.querySelector("button");

    button.disabled = true;

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();
        document.getElementById("message").innerText = data.message;

        if (response.ok && data.success) {
            alert("Login bem-sucedido!");
            window.location.href = "/confirmlog"; // Redireciona após sucesso
        } else {
            alert(data.message || "Falha no login");
        }
    } catch (error) {
        console.error("Erro na requisição de login:", error);
        alert("Erro ao fazer login. Tente novamente.");
    } finally {
        button.disabled = false;
    }
});
