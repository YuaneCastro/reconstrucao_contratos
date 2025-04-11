function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

document.getElementById('logout-button')?.addEventListener('click', () => {
    const a = window.confirm('Pretende realmente fazer logout ?');
    if(a == true){
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = '/login-cordenacao';
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const telefoneInput = document.getElementById("telefone");
    const classeSelect = document.getElementById("classe");
    const form = document.getElementById("form-estudante");

    telefoneInput.addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, "");
        validarCampos();
    });

    classeSelect.addEventListener("change", function () {
        verificarClasse();
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
                document.getElementById('mensagem').textContent = "Erro: " + resultado.motivo;
                document.getElementById('mensagem').style.color = "red";
            }
        } catch (error) {
            console.error('Erro ao cadastrar estudante:', error);

            if (error.message.includes("Failed to fetch")) {
                document.getElementById('mensagem').textContent = "Não foi possível conectar ao servidor. Verifique sua conexão.";
            } else {
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

function validarFormulario() {
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("encarregado_email").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const classeSelecionada = document.getElementById("classe").value;
    const curso = document.getElementById("curso").value;

    if (!nome || !email || !telefone || !classeSelecionada) {
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

      // Função para enviar os dados do formulário via AJAX
      document.getElementById("form-editar").addEventListener("submit", function(event) {
        event.preventDefault(); // Impede o envio tradicional do formulário

        // Pegando os valores do formulário
        const id = document.getElementById("editar-id").value;
        const nome = document.getElementById("editar-nome").value;
        const email = document.getElementById("editar-email").value;
        const telefone = document.getElementById("editar-telefone").value;
        
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
            if (data.error) {
                // Exibe a mensagem de erro se a informação já existir
                document.getElementById("error-message").innerText = data.error;
                document.getElementById("error-message").style.display = "block";
            } else {
                // Se a atualização for bem-sucedida, talvez você queira redirecionar ou limpar os campos
                alert("Atualização bem-sucedida!");
                // Aqui você pode redirecionar ou limpar o formulário, conforme preferir.
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
            fetch("/deletar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }) // Envia os dados em JSON
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                alert("Encarregado e estudantes associados deletados com sucesso.");
                location.reload();  // Atualiza a página após a exclusão
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






    
    // ===== FORMULÁRIO DOS ESTUDANTES =====
    const editStudentButtons = document.querySelectorAll(".edit-btn-student");

    editStudentButtons.forEach(button => {
        button.addEventListener("click", () => {
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
