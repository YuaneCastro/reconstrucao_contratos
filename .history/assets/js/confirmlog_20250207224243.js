async function verifyOTP() {
    const code = document.getElementById('otpInput').value;
    const response = await fetch('/verifyOTP', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
    });

    const data = await response.json();
    document.getElementById('message').innerText = data.message;

    if (response.ok && data.redirectUrl) {
        window.location.href = data.redirectUrl;
    }
}

async function resendOTP() {
    const response = await fetch('/resendOTP', { method: 'POST' });
    const data = await response.json();
    document.getElementById('message').innerText = data.message;
}