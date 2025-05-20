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