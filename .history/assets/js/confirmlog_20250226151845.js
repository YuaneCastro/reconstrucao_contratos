async function verifyOTP() {
    const codigo = document.getElementById("otpInput").value;
    const email = sessionStorage.getItem("userEmail"); // Pegando email salvo

    if (!email) {
        alert("Erro: Email não encontrado! Faça login novamente.");
        window.location.href = "/login";
        return;
    }

    try {
        const response = await fetch("/confirmlog", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, codigo })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Código verificado com sucesso!");
            window.location.href = "/dashboard"; // Redireciona após sucesso
        } else {
            alert(data.message || "Código inválido ou expirado.");
        }
    } catch (error) {
        console.error("Erro na verificação:", error);
        alert("Erro ao confirmar código. Tente novamente.");
    }
}
