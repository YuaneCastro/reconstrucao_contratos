async function verifyOTP() {
    const code = document.getElementById('otpInput').value;
    const email = "<%= email %>";

    const response = await fetch('/verifyOTP', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
    });

    const data = await response.json();
    document.getElementById('message').innerText = data.message;

    if (response.ok && data.token) {
        localStorage.setItem("token", data.token); // 🔑 Salva token
        document.cookie = `token=${data.token}; path=/`; // 🔑 Salva como cookie
        window.location.href = "/dashboard"; // 🔄 Redireciona
    }
}