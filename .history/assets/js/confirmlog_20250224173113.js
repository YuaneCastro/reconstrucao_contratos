async function verificarCodigo() {
    const codigo = document.getElementById("codigo").value;
    const email = localStorage.getItem("email"); // Pegando o e-mail armazenado no localStorage (caso necessário)

    if (!codigo) {
        document.getElementById("mensagem").innerText = "Por favor, insira o código.";
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/verificar-codigo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, code: codigo })
        });

        const data = await response.json();
        
        if (response.ok) {
            document.getElementById("mensagem").innerText = data.message;
            document.getElementById("mensagem").style.color = "green";
            setTimeout(() => window.location.href = "telap", 2000); // Redireciona após sucesso
        } else {
            document.getElementById("mensagem").innerText = data.message;
            document.getElementById("mensagem").style.color = "red";
        }

    } catch (error) {
        console.error("Erro ao verificar código:", error);
        document.getElementById("mensagem").innerText = "Erro no servidor. Tente novamente.";
    }
}
