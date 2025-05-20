document.getElementById("otpForm").addEventListener("submit", function(event) {
    let inputField = document.getElementById("otpInput");
    const button = event.target.querySelector("button");

    // Limpa espaços antes, depois e no meio
    let cleanCode = inputField.value.trim().replace(/\s+/g, "");

    // Validação: apenas números
    if (!/^\d+$/.test(cleanCode)) {
        alert("O código de verificação deve conter apenas números.");
        event.preventDefault(); // Impede envio
        return;
    }

    inputField.value = cleanCode;
    button.disabled = true;
});

// Impede espaços e letras/símbolos ao digitar
document.getElementById("otpInput").addEventListener("input", function () {
    // Remove tudo que não for número
    this.value = this.value.replace(/[^\d]/g, "");
});
document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Impede o comportamento padrão do formulário

    let emailField = document.getElementById("email");
    let senhaField = document.getElementById("password");
    const button = document.querySelector("button");

    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const loginError = document.getElementById("loginError");

    loginError.textContent = "";

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
            loginError.textContent = data.message || "Falha no login.";
        }
    } catch (error) {
        console.error("Erro na requisição de login:", error);
        errorMessage.textContent = "Erro ao fazer login. Tente novamente.";
    } finally {
        button.disabled = false; // Reativa o botão após tentativa
    }
});