async function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const button = document.querySelector('button');

    button.disabled = true; // Evita múltiplos cliques

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha: password })
        });

        const data = await response.json();

        if (response.ok) {
            console.log("Login bem-sucedido! Exibindo modal de código.");
            document.getElementById('modal').style.display = 'flex'; // Mostra modal

            // Aguarda 500ms para exibir o modal e redireciona
            setTimeout(() => {
                window.location.href = "/confirmlog"; // 🔥 Redireciona corretamente
            }, 500);
        } else {
            console.error("Erro no login:", data.message);
            alert(data.message || 'Falha no login');
        }
    } catch (error) {
        console.error("Erro na requisição de login:", error);
        alert("Erro ao fazer login. Tente novamente.");
    } finally {
        button.disabled = false;
    }
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}
