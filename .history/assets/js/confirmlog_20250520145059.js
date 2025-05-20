document.getElementById("otpForm").addEventListener("submit", async function(event) {
    let inputField = document.getElementById("otpInput");
    const button = event.target.querySelector("confirmarBtn");

    const otpError = document.getElementById("otpError");
    const confirmError = document.getElementById("confirmError");

     // Limpa mensagens de erro anteriores
     otpError.textContent = "";
     confirmError.textContent = "";
    
    // Limpa espaços e valida
    let cleanCode = inputField.value.trim().replace(/\s+/g, "");
    
    // Validação: apenas números
    if (!/^\d+$/.test(cleanCode)) {
        alert("O código de verificação deve conter apenas números.");
        event.preventDefault(); // Impede envio
        return;
    }

    inputField.value = cleanCode;
    button.disabled = true;

    try {
        const response = await fetch("/confirmlog", {  // <- aqui é o **endpoint**
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ codigo: cleanCode })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            window.location.href = "/sucesso";  // Ou o destino final
        } else {
            confirmError.textContent = data.message || "Falha na confirmação do código.";
        }

    } catch (error) {
        console.error("Erro na requisição:", error);
        confirmError.textContent = "Erro ao confirmar código. Tente novamente.";
    } finally {
        button.disabled = false;
    }
});

// Impede espaços e letras/símbolos ao digitar
document.getElementById("otpInput").addEventListener("input", function () {
    // Remove tudo que não for número
    this.value = this.value.replace(/[^\d]/g, "");
});