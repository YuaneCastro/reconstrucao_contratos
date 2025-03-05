async function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha: password })
    });

    if (response.ok) {
        document.getElementById('modal').style.display = 'flex';
    } else {
        const data = await response.json();
        alert(data.message || 'Falha no login');
    }
}

document.getElementById('login-button').addEventListener('click', async function(event) {
    event.preventDefault();
    await handleLogin();
});

document.getElementById('confirm-button').addEventListener('click', async function() {
    const code = document.getElementById('codigo').value;
    const response = await fetch('/api/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
    });

    const data = await response.json();
    if (response.ok) {
        document.cookie = `token=${data.token}; path=/;`;
        window.location.href = `/telap?token=${data.token}`;
    } else {
        alert(data.message || 'Código inválido ou expirado');
    }
});