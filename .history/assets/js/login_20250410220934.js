document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Impede o comportamento padrão do formulário

    let emailField = document.getElementById("email");
    let senhaField = document.getElementById("password");
    const button = document.querySelector("button");

    // Remove espaços antes, depois e dentro do e-mail
    let email = emailField.value.trim().replace(/\s+/g, "");
    let senha = senhaField.value.replace(/\s/g, ""); // Remove espaços da senha

    // Expressões regulares para validar email e senha
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^[a-zA-Z0-9_]{4,}$/; // Apenas letras, números e _

    // Atualiza os campos com os valores limpos
    emailField.value = email;
    senhaField.value = senha;

    // Validações antes de enviar ao backend
    if (!emailRegex.test(email)) {
        alert("Por favor, insira um email válido.");
        return;
    }
    if (!passwordRegex.test(senha)) {
        alert("A senha deve ter pelo menos 6 caracteres e pode conter apenas letras, números e (_), sem espaços.");
        return;
    }

    button.disabled = true; // Desativa o botão para evitar múltiplos envios

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            window.location.href = "/confirmlog"; // Redireciona após sucesso
        } else {
            alert(data.message || "Falha no login");
        }
    } catch (error) {
        console.error("Erro na requisição de login:", error);
        alert("Erro ao fazer login. Tente novamente.");
    } finally {
        button.disabled = false; // Reativa o botão após tentativa
    }
});

// Impede espaços no e-mail e senha enquanto o usuário digita
document.getElementById("email").addEventListener("input", function () {
    this.value = this.value.replace(/\s/g, "");
});
document.getElementById("password").addEventListener("input", function () {
    this.value = this.value.replace(/\s/g, "");
});
