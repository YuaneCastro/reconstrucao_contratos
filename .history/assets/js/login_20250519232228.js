document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Impede o comportamento padrão do formulário

    let emailField = document.getElementById("email");
    let senhaField = document.getElementById("password");
    const button = document.querySelector("button");
    const errorMessage = document.getElementById("error-message");

    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");

    // Remove espaços antes, depois e dentro do e-mail
    let email = emailField.value.trim().replace(/\s+/g, "");
    let senha = senhaField.value.replace(/\s/g, ""); // Remove espaços da senha

    // Expressões regulares para validar email e senha
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^\d{4,}$/; // Apenas letras, números e _

    // Atualiza os campos com os valores limpos
    emailField.value = email;
    senhaField.value = senha;

    // Validações antes de enviar ao backend
    let hasError = false;
    if (!emailRegex.test(email)) {
        emailError.textContent = "Por favor, insira um email válido.";
        hasError = true;
    } else {
        emailError.textContent = ""; // Limpa se estiver válido
    }

    if (!passwordRegex.test(senha)) {
        passwordError.textContent = "A senha deve ter pelo menos 4 números.";
        hasError = true;
    } else {
        passwordError.textContent = ""; // Limpa se estiver válida
    }
    if (hasError) {
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
            if(data.message){
                errorMessage.textContent = data.message || "Falha no login.";
            } else {
                
            }
            
        }
    } catch (error) {
        console.error("Erro na requisição de login:", error);
        errorMessage.textContent = "Erro ao fazer login. Tente novamente.";
    } finally {
        button.disabled = false; // Reativa o botão após tentativa
    }
});

// Impede espaços no e-mail e senha enquanto o usuário digita
document.getElementById("email").addEventListener("input", function () {
    this.value = this.value.replace(/\s/g, "");
});
document.getElementById("password").addEventListener("input", function () {
    this.value = this.value.replace(/[^\d]/g, "");
});
