document.addEventListener("DOMContentLoaded", function () {
    // Captura o token da URL
    const token = window.location.pathname.split("/").pop();

    const senhaInput = document.getElementById("senha");
  const regraNumeros = document.getElementById("regra-numeros");
  const regraEspacos = document.getElementById("regra-espacos");
  const regraMinimo = document.getElementById("regra-minimo");
        try {
            // Envia a senha para o backend
            const response = await fetch(`/set-password/${token}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ senha })
            });

            if (response.ok) {
                alert("Senha redefinida com sucesso!");
                window.location.href = "/login";
            } else {
                const errorMessage = await response.text(); // Captura a mensagem de erro do backend
                alert(errorMessage); // Exibe a mensagem de erro para o usuário
            }
        } catch (error) {
            alert("Erro de conexão. Por favor, tente mais tarde.");
            console.error(error);
        }
    });
});