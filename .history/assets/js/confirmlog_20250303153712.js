async function verifyOTP() {
    const codigo = document.getElementById("otpCode").value;
    const button = document.getElementById("confirmButton");

    button.disabled = true; // Desativando o botão ao clicar

    try {
        const response = await fetch('/confirmlog', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ codigo })
        });

        const result = await response.json();

        if (response.ok) {
            window.location.href = result.redirectTo;
        } else {
            alert(result.error || "Erro ao confirmar código.");
        }
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao confirmar código. Tente novamente.");
    }

    button.disabled = false; // Reativando o botão caso haja erro
}