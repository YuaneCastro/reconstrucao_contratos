async function verifyOTP() {
    const code = document.getElementById('otpInput').value;
    const button = document.getElementById('verifyButton'); // Supondo que haja um botão para disparar a verificação
    button.disabled = true; // Desabilita o botão enquanto o processo de verificação ocorre

    if (!code) {
        alert("Por favor, insira o código.");
        button.disabled = false; // Reabilita o botão caso haja erro
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
    } finally {
        button.disabled = false; // Reabilita o botão independentemente do resultado
    }
}
