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
    if (/^\d+$/.test(senha) && senha !== "") {
        regraNumeros.className = "ok";
        validNumeros = true;
      } else {
        regraNumeros.className = senha === "" ? "" : "erro";
      }
  
      // Validação: sem espaços (garantido pelo replace)
      if (!/\s/.test(senha) && senha !== "") {
        regraEspacos.className = "ok";
        validEspacos = true;
      } else {
        regraEspacos.className = senha === "" ? "" : "erro";
      }
  
      // Validação: mínimo de 4 números
      if (senha.length >= 4) {
        regraMinimo.className = "ok";
        validMinimo = true;
      } else {
        regraMinimo.className = senha === "" ? "" : "erro";
      }
       // Retorna se tudo está válido
    return (validNumeros && validEspacos && validMinimo);
    }
    senhaInput.addEventListener("input", function() {
        // Apenas remove caracteres inválidos enquanto digita
        this.value = this.value.replace(/[^\d]/g, "");
      });

    document.getElementById("passwordForm").addEventListener("submit", async function (event) {
        event.preventDefault();

        // Valida no clique
        const tudoValido = validarSenha();
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