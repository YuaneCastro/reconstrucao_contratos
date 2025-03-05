document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault(); 

    const email = document.getElementById("email").value;
    const senha = document.getElementById("password").value;
    const button = document.querySelector("button");

    button.disabled = true;

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            // Guardar email na sessionStorage para a verificação
            sessionStorage.setItem("userEmail", email);
            window.location.href = "/confirmlog"; 
        } else {
            alert(data.message || "Falha no login");
        }
    } catch (error) {
        console.error("Erro na requisição de login:", error);
        alert("Erro ao fazer login. Tente novamente.");
    } finally {
        button.disabled = false;
    }
});
