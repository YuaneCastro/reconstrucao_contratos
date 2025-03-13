document.querySelector("form").addEventListener("submit", async function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    let nomeField = document.querySelector("input[name='nome']");
    let emailField = document.querySelector("input[name='email']");
    let senhaField = document.querySelector("input[name='senha']");
    const button = document.querySelector("button");

    // Limpa espaços extras no nome e e-mail
    let nome = nomeField.value.trim();
    let email = emailField.value.trim().replace(/\s+/g, "");
    let senha = senhaField.value.replace(/\s/g, ""); // Remove espaços da senha

    // Expressões regulares para validação
    const nomeRegex = /^[a-zA-Z0-9_]{3,}$/; // Apenas letras, números e _ (mínimo 3 caracteres)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^[a-zA-Z0-9_]{6,}$/; // Apenas letras, números e _ (mínimo 6 caracteres)

    // Atualiza os campos com os valores limpos
    nomeField.value = nome;
    emailField.value = email;
    senhaField.value = senha;

    // Validações
    if (!nomeRegex.test(nome)) {
        alert("O nome deve ter pelo menos 3 caracteres e pode conter apenas letras, números e (_).");
        return;
    }
    if (!emailRegex.test(email)) {
        alert("Por favor, insira um email válido.");
        return;
    }
    if (!passwordRegex.test(senha)) {
        alert("A senha deve ter pelo menos 6 caracteres e pode conter apenas letras, números e (_), sem espaços.");
        return;
    }

    button.disabled = true; // Evita múltiplos envios

    try {
        const response = await fetch("/cadastro", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, email, senha })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            alert("Cadastro realizado com sucesso!");
            window.location.href = "/bemvindo"; // Redireciona após sucesso
        } else {
            alert(data.message || "Falha no cadastro");
        }
    } catch (error) {
        console.error("Erro na requisição de cadastro:", error);
        alert("Erro ao realizar cadastro. Tente novamente.");
    } finally {
        button.disabled = false; // Reativa o botão após tentativa
    }
});

// Impede espaços no e-mail e senha enquanto o usuário digita
document.querySelector("input[name='email']").addEventListener("input", function () {
    this.value = this.value.replace(/\s/g, "");
});
document.querySelector("input[name='senha']").addEventListener("input", function () {
    this.value = this.value.replace(/\s/g, "");
});
