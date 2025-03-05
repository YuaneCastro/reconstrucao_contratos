document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
    });

    const data = await response.json();
    document.getElementById("message").innerText = data.message;

    if (data.step === "verify") {
        sessionStorage.setItem("email", email);
        window.location.href = "/confirmloc"; // Ir para a página de verificação
    }
});