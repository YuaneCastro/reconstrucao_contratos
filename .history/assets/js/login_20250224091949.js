async function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const button = document.querySelector('button');

    button.disabled = true;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha: password })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            console.log("Código enviado! Aguarde a verificação.");
            alert("Código enviado! Verifique seu e-mail.");
            // Pode adicionar um redirecionamento manual aqui depois que o usuário confirmar o código
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
