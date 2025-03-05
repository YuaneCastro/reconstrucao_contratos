document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha }) // Envia email e senha em formato JSON
        });

        const data = await response.json(); // 🔴 Pegando a resposta corretamente

        if (response.ok) {
            localStorage.setItem('token', data.token); // Armazena o token (se existir)
            window.location.href = '/confirmlog'; // 🔴 Redireciona para confirmlog
        } else {
            alert(data.message || 'Erro no login!');
            console.log(data);
        }
    } catch (err) {
        console.error('Erro ao enviar dados:', err);
        alert('Erro ao fazer login.');
    }
});
