async function verifyOTP() {
    const code = document.getElementById('otpInput').value;
    const button = document.querySelector('button'); // Seleciona o botão para desabilitar após clique
    button.disabled = true; // Desabilita o botão enquanto o processo de verificação ocorre

    console.log("Função verifyOTP chamada.");
    
    if (!code) {
        alert("Por favor, insira o código.");
        button.disabled = false; // Reabilita o botão caso haja erro
        return;
    }

    console.log("Código inserido:", code);

    try {
        const response = await fetch('/confirmlogin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
        });

        console.log("Resposta do servidor:", response);
        const result = await response.json();
        console.log("Resultado da resposta JSON:", result);

        if (response.ok) {
            console.log("Código confirmado com sucesso. Redirecionando...");
            window.location.href = "/telap";  // Redireciona para a dashboard
        } else {
            console.error("Código inválido ou outro erro:", result.message);
            alert(result.message || "Código inválido.");
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro ao confirmar código. Tente novamente.");
    } finally {
        button.disabled = false; // Reabilita o botão independentemente do resultado
    }
}
