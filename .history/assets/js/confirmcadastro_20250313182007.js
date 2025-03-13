document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("confirmForm").addEventListener("submit", function (event) {
        let inputField = document.getElementById("confirmationCode");
        const button = event.target.querySelector("button");

        // Remove espaços antes, depois e dentro do código
        let cleanCode = inputField.value.trim().replace(/\s+/g, ""); 

        // Permitir apenas números
        if (!/^\d+$/.test(cleanCode)) {
            alert("O código de confirmação deve conter apenas números.");
            event.preventDefault(); // Bloqueia o envio do formulário
            return;
        }

        inputField.value = cleanCode; // Atualiza o campo com o valor limpo
        button.disabled = true; // Evita envios repetidos enquanto processa a requisição
    });
});
