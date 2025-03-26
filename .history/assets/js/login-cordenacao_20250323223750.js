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
document.getElementById("otpInput").addEventListener("input", function() {
    document.getElementById("confirmarBtn").disabled = this.value.trim() === "";
});

document.getElementById("confirmarBtn").addEventListener("click", async function () {
    const codigo = document.getElementById("otpInput").value.trim();

    if (codigo === "") {
        alert("Por favor, insira o código de verificação.");
        return;
    }

    try {
        const response = await fetch("/confirmar-codigo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ codigo })
        });
        alert()
        console.log("Status da resposta:", response.status);

        const data = await response.json();

        if (response.ok && data.success) {
            alert("Login bem-sucedido!");
            window.location.href = "/dashboard-cordenacao"; // Redireciona após sucesso
        } else {
            alert(data.message || "Falha no login");
        }
    } catch (error) {
        console.error("Erro na requisição de login:", error);
        alert("Erro ao fazer login. Tente novamente.");
    } finally {
        button.disabled = false; // Reativa o botão após tentativa
    }
});
