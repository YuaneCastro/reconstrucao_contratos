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
    

    document.addEventListener("DOMContentLoaded", function () {
        document.getElementById("telefone").addEventListener("input", function () {
            this.value = this.value.replace(/\D/g, ""); // Permitir apenas números
        });
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
    
        // Verificar se os campos obrigatórios estão preenchidos
        if (!nome || !email || !telefone) {
            alert("Todos os campos são obrigatórios.");
            return false;
        }
    
        // Verificar formato do e-mail
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            alert("E-mail inválido.");
            return false;
        }
    
        // Verificar telefone
        if (telefone.length < 9) {
            alert("Número de telefone inválido.");
            return false;
        }
    
        // Se a classe exigir um curso e ele não for selecionado, impede o envio
        if (["10ª Classe", "11ª Classe", "12ª Classe", "13ª Classe"].includes(classeSelecionada) && !curso) {
            alert("Por favor, selecione um curso antes de continuar.");
            return false;
        }
    
        return true;
    }
    document.addEventListener("DOMContentLoaded", function () {
        const form = document.getElementById("form-estudante");
        const botao = document.getElementById("botao_cadastro");
        const mensagemServidor = document.getElementById("mensagem-servidor");
    
        const camposObrigatorios = ["nome", "data_nascimento", "classe", "turma", "encarregado_nome", "encarregado_email", "telefone"];
    
        camposObrigatorios.forEach(campo => {
            document.getElementById(campo).addEventListener("input", validarCampos);
        });
    
        document.getElementById("curso")?.addEventListener("change", validarCampos);
        document.getElementById("classe")?.addEventListener("change", validarCampos);
    
        async function validarCampos() {
            const valores = camposObrigatorios.map(id => document.getElementById(id).value.trim());
            const classe = document.getElementById("classe").value;
            const curso = document.getElementById("curso").value;
    
            let camposPreenchidos = valores.every(valor => valor !== "");
    
            if (["10ª Classe", "11ª Classe", "12ª Classe", "13ª Classe"].includes(classe)) {
                camposPreenchidos = camposPreenchidos && curso !== "";
            }
    
            if (camposPreenchidos) {
                // Verificação no backend
                const dados = {
                    nome: document.getElementById("nome").value.trim(),
                    encarregado_nome: document.getElementById("encarregado_nome").value.trim(),
                    encarregado_email: document.getElementById("encarregado_email").value.trim(),
                    telefone: document.getElementById("telefone").value.trim()
                };
    
                try {
                    const resposta = await fetch("/verificar-estudante", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(dados)
                    });
    
                    const resultado = await resposta.json();
                    mensagemServidor.style.color = resultado.sucesso ? "green" : "red";
                    mensagemServidor.textContent = resultado.mensagem;
    
                    botao.disabled = !resultado.sucesso;
                } catch (error) {
                    mensagemServidor.style.color = "red";
                    mensagemServidor.textContent = "Erro ao validar informações. Tente novamente.";
                    botao.disabled = true;
                }
            } else {
                mensagemServidor.textContent = "";
                botao.disabled = true;
            }
        }
    });
    
    
    
