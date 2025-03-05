(async function verifyOTP() {
    const code = document.getElementById('otpInput')?.value; // Verifica se existe o input
    const email = localStorage.getItem("email"); // Pegue o email salvo no login
    const button = document.querySelector('button');

    button.disabled = true;

    if (!code || !email) {
        alert("Por favor, insira o código e verifique se o email está salvo.");
        console.error("Erro: Código ou email ausente.");
        button.disabled = false;
        return;
    }

    try {
        console.log("Enviando para o backend:", { email, codigo: code });

        const response = await fetch('/confirmlogin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, codigo: code })
        });

        const result = await response.json();
        console.log("Resposta do servidor:", result);

        if (response.ok && result.success) {
            console.log("Código validado! Redirecionando...");
            window.location.href = result.redirect;
        } else {
            console.error("Código inválido:", result.message);
            alert(result.message || "Código inválido.");
        }
    } catch (error) {
        console.error("Erro na verificação do código:", error);
        alert("Erro ao confirmar código. Tente novamente.");
    } finally {
        button.disabled = false;
    }
})();
