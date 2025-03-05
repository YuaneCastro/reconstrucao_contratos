async function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const button = document.querySelector('button');

    button.disabled = true;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha: password })
        });
    
        console.log("🚀 Resposta do servidor:", response);
    
        if (!response.ok) {
            console.error("❌ Erro no login:", response.status, response.statusText);
            alert(`Erro: ${response.statusText}`);
            return;
        }
    
        const data = await response.json();
        console.log("✅ Dados recebidos:", data);
    
        if (data.success) {
            console.log("Login bem-sucedido! Redirecionando...");
            window.location.href = "/confirmlog";
        } else {
            console.error("Erro no login:", data.message);
            alert(data.message || 'Falha no login');
        }
    } catch (error) {
        console.error("🚨 Erro na requisição:", error);
        alert("Erro ao fazer login. Tente novamente.");
    }
    
}