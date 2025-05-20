document.getElementById("otpForm").addEventListener("submit", function(event) {
    let inputField = document.getElementById("otpInput");
    const button = event.target.querySelector("confirmarBtn");

    const otpError = document.getElementById("otpError");
    const confirmError = document.getElementById("confirmError");
    // Limpa espaços antes, depois e no meio
    let cleanCode = inputField.value.trim().replace(/\s+/g, "");

     // Limpa mensagens de erro anteriores
     otpError.textContent = "";
     confirmError.textContent = "";

    let cleanCode = inputField.value.trim().replace(/\s+/g, "");

    inputField.value = cleanCode;
    button.disabled = true;
});

// Impede espaços e letras/símbolos ao digitar
document.getElementById("otpInput").addEventListener("input", function () {
    // Remove tudo que não for número
    this.value = this.value.replace(/[^\d]/g, "");
});