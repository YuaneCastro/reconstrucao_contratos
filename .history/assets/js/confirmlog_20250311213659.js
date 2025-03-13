document.getElementById("otpForm").addEventListener("submit", function(event) {
    const button = event.target.querySelector("button");
    button.disabled = true; // Evita envios repetidos enquanto processa a requisição
});