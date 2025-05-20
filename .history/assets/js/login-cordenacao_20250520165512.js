    document.getElementById("enviarBtn").addEventListener("click", async function() {
        const enviarBtn = this;
        const otpInput = document.getElementById("otpInput");
        const mensagem = document.getElementById("mensagem");

        // Desabilita o botão de enviar
        enviarBtn.disabled = true;
        enviarBtn.innerText = "Enviando...";

        // Chama o backend para enviar o e-mail
        try {
            const response = await fetch("/login-cordenacao", { method: "POST" });
            const data = await response.json();
            
            if (data.success) {

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
        this.value = this.value.replace(/\D/g, ""); // Remove tudo que não for número
        document.getElementById("confirmarBtn").disabled = this.value.trim() === "";
    });

    document.getElementById("confirmarBtn").addEventListener("click", async function (event) {
        event.preventDefault(); // <-- Isso é ESSENCIAL para evitar que o formulário recarregue a página
    
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
    
            console.log("Status da resposta:", response.status);
    
            if (!response.ok) {
                alert("Erro na requisição: " + response.status);
                return;
            }
    
            const data = await response.json();
            if (response.ok && data.success) {
                // Redireciona corretamente
                window.location.href = '/dashboard-cordenacao';
            } else {
                alert(data.message || "Falha no login");
            }
        } catch (error) {
            console.error("Erro na requisição de login:", error);
            alert("Erro ao fazer login. Tente novamente.");
        } finally {
            document.getElementById("confirmarBtn").disabled = false;
        }
    });