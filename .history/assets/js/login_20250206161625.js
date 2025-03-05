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

        if (!response.ok) { 
            const errorData = await response.json();
            alert(errorData.message || 'Erro no login!');
            return;
        } 
        localStorage.setItem('token', data.token);

        // Redireciona usando o URL retornado do backend
        if (data.redirectUrl) {
            window.location.href = data.redirectUrl; // Redireciona para /confirmlog
        }
    } catch (err) {
        console.error('Erro ao enviar dados:', err);
        alert('Erro ao fazer login.');
    }
});
