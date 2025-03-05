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

        if (response.ok) {
            const data = await response.json();
            alert('Login bem-sucedido!');
            console.log(data);
        } else {
            const errorData = await response.json();
            alert(errorData.message || 'Erro no login!');
            console.log(errorData);
        }
    } catch (err) {
        console.error('Erro ao enviar dados:', err);
        alert('Erro ao fazer login.');
    }
});