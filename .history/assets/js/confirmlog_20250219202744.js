(async function verifyOTP() {
    const email = document.getElementById('email').value;
    const code = document.getElementById('otpInput').value;
    const button = document.querySelector('button');

    button.disabled = true;

    if (!code || !email) {
        alert("Por favor, insira seu email e código.");
        button.disabled = false;
        return;
    }

    try {
        const response = await fetch('/confirmlogin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, codigo: code }) // 🔥 Agora inclui email
        });

        const result = await response.json();

        if (response.ok) {
            console.log("Código validado! Redirecionando...");
            window.location.href = "/telap";
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
