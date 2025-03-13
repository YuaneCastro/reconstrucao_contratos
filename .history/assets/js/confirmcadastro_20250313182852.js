document.querySelector("form").addEventListener("submit", async function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    let codeField = document.querySelector("input[name='confirmationCode']");
    let confirmationCode = codeField.value.trim().replace(/\s+/g, ""); // Remove espaços

    const button = document.querySelector("button");

    // Atualiza o campo com o valor limpo
    codeField.value = confirmationCode;

    // Valida se o código não está vazio
    if (confirmationCode.length === 0) {
        alert("Por favor, insira um código de confirmação válido.");
        return;
    }

    button.disabled = true; // Evita múltiplos envios

    try {
        const response = await fetch("/confirmcad", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ confirmationCode })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            alert("Código confirmado com sucesso!");
            window.location.href = "/bemvindo"; // Redireciona após sucesso
        } else {
            alert(data.message || "Código inválido. Tente novamente.");
        }
    } catch (error) {
        console.error("Erro na requisição de confirmação:", error);
        alert("Erro ao confirmar código. Tente novamente.");
    } finally {
        button.disabled = false; // Reativa o botão após tentativa
    }
});

// Impede espaços no código enquanto o usuário digita
document.querySelector("input[name='confirmationCode']").addEventListener("input", function () {
    this.value = this.value.replace(/\s/g, "");
});

