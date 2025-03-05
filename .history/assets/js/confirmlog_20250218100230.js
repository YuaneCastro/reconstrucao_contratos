async function handleLogin() {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha: password })
            });

            const data = await response.json();
            if (response.ok) {
                document.getElementById('modal').style.display = 'flex';
            } else {
                alert(data.message || 'Falha no login');
            }
        }

        function closeModal() {
            document.getElementById('modal').style.display = 'none';
            alert("Código confirmado!");
        }