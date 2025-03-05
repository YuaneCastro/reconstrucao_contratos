async function verifyOTP() {
    const code = document.getElementById('otpInput').value;
    const button = document.querySelector('button'); // Seleciona o botão de confirmação

    // Desabilita o botão
    button.disabled = true;
    button.textContent = 'Verificando...'; // Altera o texto do botão para feedback visual

    try {
        const response = await fetch('/confirmlogin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email: "email_do_usuario", // Substitua pelo email do usuário
                codigo: code 
            })
        });

        const result = await response.json();

        if (response.ok) {
            console.log("Código validado! Redirecionando...");
            window.location.href = "/telap"; // Redireciona para a próxima tela
        } else {
            console.error("Código inválido:", result.message);
            alert(result.message || "Código inválido.");
        }
    } catch (error) {
        console.error("Erro na verificação do código:", error);
        alert("Erro ao confirmar código. Tente novamente.");
    } finally {
        // Reabilita o botão em caso de erro
        button.disabled = false;
        button.textContent = 'Confirmar'; // Restaura o texto original do botão
    }
}