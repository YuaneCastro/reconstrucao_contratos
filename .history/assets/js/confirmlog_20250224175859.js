document.getElementById("codigoForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = sessionStorage.getItem("email");
    if (!email) {
        document.getElementById("message").innerText = "Erro: Nenhum e-mail encontrado!";
        return;
    }

    const codigo = document.getElementById("codigo").value;

    const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, codigo })
    });

    const data = await response.json();
    document.getElementById("message").innerText = data.message;

    if (data.step === "success") {
        alert("Login realizado com sucesso!");
        window.location.href = "/telap"; // Redireciona para outra página
    }
});
