    document.getElementById("enviarBtn").addEventListener("click", async function() {
        const enviarBtn = this;
        const otpInput = document.getElementById("otpInput");
        const mensagem = document.getElementById("mensagem");

        // Desabilita o botão de enviar
        enviarBtn.disabled = true;
        enviarBtn.innerText = "Enviando...";
        mensagem.textContent = "Enviando código...";

        // Chama o backend para enviar o e-mail
        try {
            const response = await fetch("/login-cordenacao", { method: "POST" });
            const data = await response.json();
            
            if (data.success) {
                // Habilita o input e botão de confirmar
                otpInput.disabled = false;
                enviarBtn.innerText = "Código Enviado";
                mensagem.textContent = "Código enviado com sucesso!";
            }
        } catch (error) {
            enviarBtn.disabled = false;
            enviarBtn.innerText = "Enviar";
            mensagem.textContent = "Erro ao tentar enviar. Tente novamente.";
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
        const mensagem = document.getElementById("mensagem");

        if (codigo === "") {
            mensagem.textContent = "Por favor, insira o código de verificação.";
            return;
        }
    
        try {
            const response = await fetch("/confirmar-codigo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ codigo })
            });
    
            const data = await response.json();

            if (response.ok && data.success) {
                // Redireciona corretamente
                window.location.href = '/dashboard-cordenacao';
            } else {
                mensagem.textContent = data.message || "Falha na verificação.";
            }
        } catch (error) {
            console.error("Erro na requisição de login:", error);
            alert("Erro ao fazer login. Tente novamente.");
        } finally {
            document.getElementById("confirmarBtn").disabled = false;
        }
    });