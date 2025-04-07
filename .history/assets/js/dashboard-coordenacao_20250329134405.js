function showSection(sectionId) {
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');
    }

    document.getElementById('logout-button')?.addEventListener('click', () => {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = '/login-cordenacao';
    });

    formulario.addEventListener("submit", async function (event) {
        event.preventDefault();
    
        if (!validarFormulario()) return;
    
        const formData = new FormData(formulario);
        const data = Object.fromEntries(formData.entries());
    
        try {
            const resposta = await fetch("/cadastro", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
    
            const resultado = await resposta.json();
    
            if (!resposta.ok) {
                mensagemErro.textContent = resultado.mensagem || "Erro ao cadastrar.";
                mensagemErro.style.display = "block";
                return;
            }
    
            if (!resultado.sucesso) {
                mensagemErro.textContent = resultado.mensagem;
                mensagemErro.style.display = "block";
            } else {
                mensagemErro.style.display = "none";
                alert("Estudante cadastrado com sucesso!");
                formulario.reset();
                submitButton.disabled = true;
            }
        } catch (error) {
            mensagemErro.textContent = "Erro ao enviar dados. Tente novamente.";
            mensagemErro.style.display = "block";
        }
    });
    

    function verificarClasse() {
        const classeSelecionada = document.getElementById("classe").value;
        const cursoContainer = document.getElementById("cursoContainer");
        const curso = document.getElementById("curso");

        if (["10ª Classe", "11ª Classe", "12ª Classe", "13ª Classe"].includes(classeSelecionada)) {
            cursoContainer.style.display = "block";
            curso.setAttribute("required", "true");
        } else {
            cursoContainer.style.display = "none";
            curso.removeAttribute("required");
            curso.value = "";
        }
    }

    function validarFormulario() {
        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("encarregado_email").value.trim();
        const telefone = document.getElementById("telefone").value.trim();
        const classeSelecionada = document.getElementById("classe").value;
        const curso = document.getElementById("curso").value;

        if (!nome || !email || !telefone) {
            alert("Todos os campos são obrigatórios.");
            return false;
        }

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            alert("E-mail inválido.");
            return false;
        }

        if (telefone.length < 9) {
            alert("Número de telefone inválido.");
            return false;
        }

        if (["10ª Classe", "11ª Classe", "12ª Classe", "13ª Classe"].includes(classeSelecionada) && !curso) {
            alert("Por favor, selecione um curso antes de continuar.");
            return false;
        }

        return true;
    }

    function exibirMensagemErro(mensagem) {
        const mensagemErro = document.getElementById("mensagem-erro");
        mensagemErro.textContent = mensagem;
        mensagemErro.style.display = "block";
    }
    
