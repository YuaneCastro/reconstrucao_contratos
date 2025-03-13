document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault(); // Impede envio automático

    const nome = document.querySelector("[name='nome']").value.trim();
    const email = document.querySelector("[name='email']").value.trim();
    let senha = document.querySelector("[name='senha']").value;
    const button = document.querySelector("button");

    // Expressões regulares para validar nome, email e senha
    const nomeRegex = /^[a-zA-Z0-9_]{3,}$/; // Nome deve ter pelo menos 3 caracteres e pode conter letras, números e "_"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const senhaRegex = /^[a-zA-Z0-9_]{6,}$/; // Senha: pelo menos 6 caracteres, sem espaços

    // Bloqueia espaços na senha ao digitar
    document.querySelector("[name='senha']").addEventListener("input", function () {
        this.value = this.value.replace(/\s/g, ""); // Remove qualquer espaço digitado
    });

    // Validações antes de enviar ao backend
    if (!nomeRegex.test(nome)) {
        alert("Nome de usuário inválido! Deve ter pelo menos 3 caracteres e não pode conter espaços.");
        return;
    }

    if (!emailRegex.test(email)) {
        alert("Por favor, insira um email válido.");
        return;
    }

    if (!senhaRegex.test(senha)) {
        alert("A senha deve ter pelo menos 6 caracteres e pode conter apenas letras, números e (_), sem espaços.");
        return;
    }

    button.disabled = true; // Bloqueia o botão enquanto os dados são enviados

    // Enviando os dados ao servidor via fetch
    fetch("/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha })
    })
    try {
        const response = await fetch("/cadastro", {
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
