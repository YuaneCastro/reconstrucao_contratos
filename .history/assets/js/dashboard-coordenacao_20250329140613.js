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


    document.getElementById('form-estudante').addEventListener('submit', async function (event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const dataNascimento = document.getElementById('data_nascimento').value;
    const classe = document.getElementById('classe').value;
    const curso = document.getElementById('curso').value;
    const turma = document.getElementById('turma').value;
    const encarregadoNome = document.getElementById('encarregado_nome').value;
    const encarregadoEmail = document.getElementById('encarregado_email').value;
    const telefone = document.getElementById('telefone').value;
    const mensagemServidor = document.getElementById('mensagem-servidor');

    const estudanteData = {
        nome,
        data_nascimento: dataNascimento,
        classe,
        curso,
        turma,
        encarregado_nome: encarregadoNome,
        encarregado_email: encarregadoEmail,
        telefone
    };

    try {
        const response = await fetch('/cadastro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(estudanteData)
        });

        if (!response.ok) {
            const data = await response.json();
            mensagemServidor.innerText = data.message; // aqui a mensagem é exibida na tela
            return;
        }

        const data = await response.json();
        console.log('Cadastro realizado com sucesso:', data);
        window.location.href = "/sucesso";
    } catch (error) {
        console.error('Erro ao cadastrar estudante:', error);
        mensagemServidor.innerText = 'Erro ao cadastrar estudante. Por favor, tente novamente.';
    }
});
