document.getElementById('login-button').addEventListener('click', async function(event) {
    event.preventDefault(); // Impede o envio do formulário
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
});
