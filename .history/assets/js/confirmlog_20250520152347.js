document.getElementById("otpInput").addEventListener("input", function () {
    // Remove tudo que não for número durante a digitação
    this.value = this.value.replace(/[^\d]/g, "");
});

document.getElementById("otpForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const inputField = document.getElementById("otpInput");
    const button = document.getElementById("confirmarBtn");

    const otpError = document.getElementById("otpError");
    const confirmError = document.getElementById("confirmError");

    // Limpa mensagens de erro anteriores
    otpError.textContent = "";
    confirmError.textContent = "";

    // Limpa espaços e valida
    let cleanCode = inputField.value.trim().replace(/\s+/g, "");

    if (!/^\d+$/.test(cleanCode)) {
        confirmError.textContent = "O código de verificação deve conter apenas números.";
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
            window.location.href = "/dashboard";  // Ou o destino final
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
