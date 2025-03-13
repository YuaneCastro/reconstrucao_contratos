document.addEventListener("DOMContentLoaded", function () {
        const form = document.getElementById("otpForm");
        const button = document.getElementById("verifyButton");

        async function verifyOTP() {
            const code = document.getElementById("otpInput").value;

            button.disabled = true;

            try {
                const response = await fetch('/confirmlog', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: "include",
                    body: JSON.stringify({ codigo: code })
                });

                const result = await response.json();

                if (response.ok) {
                    console.log("Código validado! Redirecionando...");
                    window.location.href = "/dashboard";
                } else {
                    console.error("Código inválido:", result.message);
                    alert(result.message || "Código inválido.");
                }
            } catch (error) {
                console.error("Erro na verificação do código:", error);
                alert("Erro ao confirmar código. Tente novamente.");
            } finally {
                button.disabled = false;
            }
        }

        // Capturar o clique do botão
        button.addEventListener("click", verifyOTP);

        // Capturar o pressionamento da tecla "Enter" dentro do input
        form.addEventListener("submit", function (event) {
            event.preventDefault(); // Evita que o formulário envie normalmente
            verifyOTP(); // Chama a mesma função
        });
    });