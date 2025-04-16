document.getElementById("otpForm").addEventListener("submit", function(event) {
    let inputField = document.getElementById("otpInput");
    const button = event.target.querySelector("button");

    // Remove espaços no início, final e dentro do código
    let cleanCode = this.value.replace(/[^\d]/g, ""); 

    // Permitir apenas números
    if (!/^\d+$/.test(cleanCode)) {
        alert("O código de verificação deve conter apenas números.");
        event.preventDefault(); // Bloqueia o envio do formulário
        return;
    }

    inputField.value = cleanCode; // Atualiza o campo com o valor limpo
    button.disabled = true; // Evita envios repetidos enquanto processa a requisição
});
