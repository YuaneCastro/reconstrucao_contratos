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
    function exibirModal(mensagem, cor = 'green') {
  const modal = document.getElementById('modalMensagem');
  const texto = document.getElementById('textoModal');
  texto.textContent = mensagem;
  texto.style.color = cor;
  modal.style.display = 'block';
  setTimeout(() => {
    modal.style.display = 'none';
  }, 4000);
}


    
    const form = document.getElementById('form-estudante');
    const classeSelect = document.getElementById('classe');
    const cursoContainer = document.getElementById('cursoContainer');
    const botaoCadastro = document.getElementById('botao_cadastro');
    const mensagemServidor = document.getElementById('mensagem-servidor');
    
    // Exibir ou ocultar o campo de curso
    classeSelect.addEventListener('change', () => {
        const classeSelecionada = classeSelect.value;
        if (['10ª Classe', '11ª Classe', '12ª Classe', '13ª Classe'].includes(classeSelecionada)) {
            cursoContainer.style.display = 'block';
        } else {
            cursoContainer.style.display = 'none';
        }
        validarCampos();
    });
    
    // Validação dos campos
    form.addEventListener('input', validarCampos);
    
    function validarCampos() {
        const campos = form.querySelectorAll('input, select');
        let valido = true;
        campos.forEach(campo => {
            if (!campo.checkValidity()) {
                valido = false;
            }
        });
        botaoCadastro.disabled = !valido;
    }
    
    // Submissão do formulário
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        mensagemServidor.textContent = '';
        mensagemServidor.style.color = 'red';
    
        const formData = new FormData(form);
        const dados = Object.fromEntries(formData);
    
        try {
            const resposta = await fetch('/cadastro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
    
            const resultado = await resposta.json();
    
            if (resposta.ok) {
                mensagemServidor.style.color = 'green';
                mensagemServidor.textContent = resultado.mensagem || 'Estudante cadastrado com sucesso!';
                mensagemServidor.style.opacity = '1';
    
                // Sumir a mensagem depois de 3s
                setTimeout(() => {
                    mensagemServidor.style.opacity = '0';
                }, 3000);
    
                form.reset();
                cursoContainer.style.display = 'none';
                botaoCadastro.disabled = true;
            } else {
                mensagemServidor.textContent = resultado.erro || 'Erro ao cadastrar o estudante.';
            }
        } catch (erro) {
            mensagemServidor.textContent = 'Erro de conexão com o servidor.';
        }
    });
    