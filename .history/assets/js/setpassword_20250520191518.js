document.addEventListener("DOMContentLoaded", function () {
    // Captura o token da URL
    const token = window.location.pathname.split("/").pop();

    const senhaInput = document.getElementById("senha");
    const regraNumeros = document.getElementById("regra-numeros");
    const regraEspacos = document.getElementById("regra-espacos");
    const regraMinimo = document.getElementById("regra-minimo");
    const redefinirBtn = document.getElementById("redefinirBtn");

    function validarSenha() {
        const senha = senhaInput.value;
    
        let validNumeros = false;
        let validEspacos = false;
        let validMinimo = false;

         // Remove qualquer caractere que não seja número (enquanto digita)
        senhaInput.value = senha.replace(/[^\d]/g, "");

        // Validação: apenas números
        if (/^\d+$/.test(senha) || senha === "") {
          regraNumeros.className = senha === "" ? "" : "ok";
        } else {
          regraNumeros.className = "erro";
        }
    
        // Validação: sem espaços (já garantido pelo replace acima)
        if (!/\s/.test(senha)) {
          regraEspacos.className = senha === "" ? "" : "ok";
        } else {
          regraEspacos.className = "erro";
        }
    
        // Validação: mínimo de 4 números
        if (senha.length >= 4) {
          regraMinimo.className = "ok";
        } else {
          regraMinimo.className = senha === "" ? "" : "erro";
        }
      });

    document.getElementById("passwordForm").addEventListener("submit", async function (event) {
        event.preventDefault();

        const senha = document.getElementById("senha").value;

        // Regex para senha contendo somente números e sem espaços
        const passwordRegex = /^\d{4,}$/;

        // Validação da senha
        if (!passwordRegex.test(senha)) {
            alert("A senha deve ter no mínimo 4 caracteres e ser composta apenas por números.");
            return;
        }

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