// logout
document.getElementById('logout-button')?.addEventListener('click', () => {
    const a = window.confirm('Pretende realmente fazer logout ?');
    if(a == true){
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = '/login-cordenacao';
    }
});

//--------mostrar campos dentro da tela
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

//--------limpa os campos para impedir pega de itens passados
function clearEditForm() {
    document.getElementById("editar-id").value = '';
    document.getElementById("editar-nome").value = '';
    document.getElementById("editar-email").value = '';
    document.getElementById("editar-telefone").value = '';
    document.getElementById("estudantes-associados").innerHTML = '';  // Limpa os estudantes associados

    document.getElementById("editar-id-estudante").value = '';
    document.getElementById("nome").value = '';
    document.getElementById("classe").value = '';
    document.getElementById("turma").value = '';
    document.getElementById("curso").value = '';
    document.getElementById("cursoContainer").style.display = 'none';
}


//-------------cadastro----------
document.addEventListener("DOMContentLoaded", function () {
    const telefoneInput = document.getElementById("telefone");
    const classeSelect = document.getElementById("classe");
    const form = document.getElementById("form-estudante");

    telefoneInput.addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, "");
        validarCampos();
    });

    classeSelect.addEventListener("change", function () {
        verificarClasse2();
        validarCampos();
    });

    form.querySelectorAll("input, select").forEach((campo) => {
        campo.addEventListener("input", validarCampos);
        campo.addEventListener("change", validarCampos);
    });

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        if (!validarFormulario()) {
            return;
        }

        const formData = new FormData(this);
        const dados = Object.fromEntries(formData.entries());
        try {
            // Flag para rastrear se a tarefa foi bem-sucedida
            const response = await fetch('/cadastro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const resultado = await response.json();

            if (resultado.sucesso) {
                sucessoCadastro = true; // ✅ Marca como sucesso
                document.getElementById('mensagem').textContent = "Estudante cadastrado com sucesso!";
                document.getElementById('mensagem').style.color = "green";
                form.reset();
                validarCampos();
                location.reload();
            } else {
                let mensagemErro = "Erro: " + resultado.motivo;

                if (resultado.motivo === "encarregado_conflito") {
                    mensagemErro = "Conflito detectado: Já existe um encarregado com dados semelhantes!";
                }
                document.getElementById('mensagem').textContent = mensagemErro;
                document.getElementById('mensagem').style.color = "red";
            }
        } catch (error) {
            if (error.message.includes("Erro HTTP: 400")) {
                console.log('Erro 400 detectado:', error);
                document.getElementById('mensagem').textContent = "Conflito detectado: Já existe um encarregado com dados semelhantes!";
            }
            // Verificando se o erro vem da resposta HTTP 500 (erro do servidor)
            else if (error.message.includes("Erro HTTP: 500")) {
                console.log('Erro 500 detectado:', error);
                document.getElementById('mensagem').textContent = "Erro interno no servidor. Tente novamente mais tarde.";
            } 
            // Falha na conexão com o servidor
            else if (error.message.includes("Failed to fetch")) {
                console.log('Falha na conexão:', error);
                document.getElementById('mensagem').textContent = "Não foi possível conectar ao servidor. Verifique sua conexão.";
            } 
            // Qualquer outro erro que não foi previsto
            else {
                console.log('Erro inesperado:', error);
                document.getElementById('mensagem').textContent = "Erro inesperado: " + error.message;
            }
        
            document.getElementById('mensagem').style.color = "red";
        }
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
function verificarClasse2() {
    const classeSelecionada = document.getElementById("classe2").value;
    const cursoContainer = document.getElementById("cursoContainer2");
    const curso = document.getElementById("curso2");

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
    const nome = document.getElementById("nome2").value.trim();
    const email = document.getElementById("encarregado_email").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const classeSelecionada = document.getElementById("classe2").value;
    const curso = document.getElementById("curso2").value;
    const turma = document.getElementById("turma2").value;
    

    if (!nome || !email || !telefone || !classeSelecionada || !turma) {
        return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
        return false;
    }

    if (telefone.length < 9) {
        return false;
    }

    if (["10ª Classe", "11ª Classe", "12ª Classe", "13ª Classe"].includes(classeSelecionada) && !curso) {
        return false;
    }

    return true;
}
function validarCampos() {
    const botaoCadastro = document.getElementById("botao_cadastro");

    if (botaoCadastro) {  // Só executa se o botão existir
        botaoCadastro.disabled = !validarFormulario();
    }
}
function toggleSubmenu(menuId) {
    let menu = document.getElementById(menuId);
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}



document.addEventListener("DOMContentLoaded", () => {
    // ===== FORMULÁRIO DOS ENCARREGADOS =====
    const editGuardianButtons = document.querySelectorAll(".edit-btn-guardian");
    editGuardianButtons.forEach(button => {
        button.addEventListener("click", () => {
            clearEditForm();
            const id = button.getAttribute("data-id");
            const nome = button.getAttribute("data-nome");
            const email = button.getAttribute("data-email");
            const telefone = button.getAttribute("data-telefone");
            const estudantesJSON = button.getAttribute("data-estudantes");
            const estudantes = JSON.parse(estudantesJSON);

            document.getElementById("editar-nome").value = nome;
            document.getElementById("editar-email").value = email;
            document.getElementById("editar-telefone").value = telefone;
            document.getElementById("editar-id").value = id;
        
            const container = document.getElementById("estudantes-associados");
            container.innerHTML = "<h4>Estudantes Associados:</h4>";
            if (estudantes.length > 0) {
                estudantes.forEach(est => {
                    const p = document.createElement("p");
                    p.textContent = `• ${est.nome} – Classe: ${est.classe}, Turma: ${est.turma}, Curso: ${est.curso}`;
                    container.appendChild(p);
                });
            } else {
                container.innerHTML += "<p style='color: gray;'>Nenhum estudante associado.</p>";
            }      

            document.getElementById("editar-encarregado").style.display = "block";
        });
    });

    // Impedir espaços no telefone
    const telefoneInput = document.getElementById("editar-telefone");
    telefoneInput.addEventListener("input", function() {
        this.value = this.value.replace(/\s+/g, ''); // Remove todos os espaços
    });

    // Impedir espaços no e-mail
    const emailInput = document.getElementById("editar-email");
    emailInput.addEventListener("input", function() {
        this.value = this.value.replace(/\s+/g, ''); // Remove todos os espaços
    });

      // Função para enviar os dados do formulário via AJAX
    document.getElementById("form-editar").addEventListener("submit", function(event) {
        event.preventDefault(); // Impede o envio tradicional do formulário

        // Pegando os valores do formulário
        const id = document.getElementById("editar-id").value;
        const nome = document.getElementById("editar-nome").value;
        const email = document.getElementById("editar-email").value;
        const telefone = document.getElementById("editar-telefone").value;
        
        if (!nome.trim() || !email.trim() || !telefone.trim()) {
            alert("Por favor, preencha todos os campos corretamente.");
            return;
        }
        
        // Enviar os dados para a rota do servidor
        fetch("/update_encarregado", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, nome, email, telefone }) // Envia os dados em JSON
        })
        .then(response => response.json()) // Espera uma resposta JSON do servidor
        .then(data => {
            if (data.sucesso) {
                alert(data.motivo); // Exibe a mensagem de sucesso
                location.reload();
            } else {
                alert(data.motivo); // Exibe a mensagem de erro
            }
        })
        .catch(error => {
            console.error("Erro ao enviar dados: ", error);
        });
    });
    document.getElementById("deletar").addEventListener("click",function(){
        const id = document.getElementById("editar-id").value;
        const confirmDelete = confirm("Se você apagar o encarregado, as informações dos estudantes que ele representa também serão apagadas. Deseja continuar?");
        if (confirmDelete){
            fetch("/deletar_encarregados", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }) // Envia os dados em JSON
            })
            .then(response => response.json())
            .then(data => {
                if (data.sucesso) {
                    alert(data.motivo);
                    location.reload();
                } else {
                    alert("Erro ao deletar o encarregado.");
                }
            })
            .catch(error => {
                console.error("Erro ao tentar deletar:", error);
                alert("Ocorreu um erro ao tentar excluir.");
            });
        }
    });
    document.getElementById("reenviar").addEventListener("click",function(){
        const id = document.getElementById("editar-id").value;
        const confirmDelete = confirm("Realmente quer enviar o link de reedifinicao de senha");
        if (confirmDelete){
            fetch("/redifinir_senha", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }) // Envia os dados em JSON
            })
            .then(response => response.json())
            .then(data => {
                if (data.sucesso) {
                    alert(data.motivo);
                    location.reload();
                } else {
                    alert("Erro ao enviar o link de confirmacao de senha.");
                }
            })
            .catch(error => {
                console.error("Erro ao tentar deletar:", error);
                alert("Ocorreu um erro ao tentar enviar o link de confirmacao de senha.");
            });
        }
    });
    






    
    // ===== FORMULÁRIO DOS ESTUDANTES =====
    const editStudentButtons = document.querySelectorAll(".edit-btn-student");

    editStudentButtons.forEach(button => {
        button.addEventListener("click", () => {
            clearEditForm();
            const id = button.getAttribute("data-id");
            const nome = button.getAttribute("data-nome");
            const classe = button.getAttribute("data-classe");
            const turma = button.getAttribute("data-turma");
            const curso = button.getAttribute("data-curso");

            document.getElementById("editar-id-estudante").value = id;
            document.getElementById("nome").value = nome;
            document.getElementById("classe").value = classe;
            document.getElementById("turma").value = turma;

            // Mostrar a seção
            showSection("edit_studentes");

            // Verifica se curso deve aparecer
            if (classe.includes("10") || classe.includes("11") || classe.includes("12") || classe.includes("13")) {
                document.getElementById("cursoContainer").style.display = "block";
                document.getElementById("curso").value = curso;
            } else {
                document.getElementById("cursoContainer").style.display = "none";
                document.getElementById("curso").value = "";
            }
        });
    });
    const formEstudante = document.getElementById("form-edit-student");

    formEstudante.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(formEstudante);
        const data = new URLSearchParams(formData);

        try {
            const response = await fetch(formEstudante.action, {
                method: formEstudante.method,
                body: data
            });

            const result = await response.json();

            if (!result.sucesso) {
                document.getElementById('error-message').textContent = result.motivo;
                document.getElementById('error-message').style.display = 'block';
            } else {
                location.reload();
            }
        } catch (error) {
            console.error('Erro ao atualizar o estudante:', error);
            alert('Houve um erro ao tentar atualizar os dados do estudante.');
        }
    });
  
});
