document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Impede o comportamento padrão do formulário

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("password").value;
    const button = document.querySelector("button");

    button.disabled = true;

    // Expressões regulares para validar email e senha
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^[a-zA-Z0-9_]{6,}$/; // Apenas letras, números e _

    document.getElementById("password").addEventListener("input", function () {
        this.value = this.value.replace(/\s/g, ""); // Remove qualquer espaço digitado
    });
    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();

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
