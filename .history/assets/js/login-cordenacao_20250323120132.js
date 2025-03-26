document.getElementById("enviarBtn").addEventListener("click", async function() {
    const enviarBtn = this;
    const otpInput = document.getElementById("otpInput");
    const confirmarBtn = document.getElementById("confirmarBtn");

    // Desabilita o botão de enviar
    enviarBtn.disabled = true;
    enviarBtn.innerText = "Enviando...";

    // Chama o backend para enviar o e-mail
    try {
        const response = await fetch("/login-cordenacao", { method: "POST" });
        const data = await response.json();
        
        if (data.success) {
            alert("Código enviado com sucesso!");
            
            // Habilita o input e botão de confirmar
            otpInput.disabled = false;
            enviarBtn.innerText = "Código Enviado";
        } else {
            alert("Erro ao enviar código.");
            enviarBtn.disabled = false;
            enviarBtn.innerText = "Enviar";
        }
    } catch (error) {
        alert("Erro ao enviar código.");
        enviarBtn.disabled = false;
        enviarBtn.innerText = "Enviar";
    }
});

// Habilita o botão "Confirmar" somente quando algo for digitado no input
