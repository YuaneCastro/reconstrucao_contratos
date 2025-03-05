async function verifyOTP() {
    const code = document.getElementById('otpInput').value;
    const button = document.querySelector('button');

    button.disabled = true;

    try {
        const response = await fetch('/confirmlog', { // Certifique-se de que a rota está correta
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: "include", // 🔹 Permite o envio de cookies
            body: JSON.stringify({ codigo: code })
        });

        const result = await response.json();

        if (response.ok) {
            console.log("Código validado! Redirecionando...");
            window.location.href = "/dashboard"; // Redireciona para a dashboard
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
}