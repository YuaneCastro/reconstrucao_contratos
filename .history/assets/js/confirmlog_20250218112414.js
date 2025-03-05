async function verifyOTP() {
    const code = document.getElementById('otpInput').value;

    if (!code) {
        alert("Por favor, insira o código.");
        return;
    }

    console.log("Enviando código:", code); // Verificar se está pegando o valor

    try {
        const response = await fetch('/confirmlog', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
        });

        const result = await response.json();
        console.log("Resposta do servidor:", result);

        if (response.ok) {
            window.location.href = "/telap";  // Redireciona para a dashboard
        } else {
            alert(result.message || "Código inválido.");
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro ao confirmar código. Tente novamente.");
    }
}