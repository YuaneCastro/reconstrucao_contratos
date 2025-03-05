async function verifyOTP() {
    const code = document.getElementById('otpInput').value;
    const response = await fetch('/verifyOTP', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
    });

    const data = await response.json();
    document.getElementById('message').innerText = data.message;

    if (response.ok && data.token) {
        localStorage.setItem("token", data.token); // 🔑 Salvar token no navegador
        window.location.href = "/dashboard"; // 🔄 Redirecionar para a dashboard
    }
}