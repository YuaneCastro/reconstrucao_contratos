// -------------logout-----------
document.getElementById('logout-button')?.addEventListener('click', () => {
    const a = window.confirm('Pretende realmente fazer logout ?');
    if(a == true){
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = '/login-cordenacao';
    }
});
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}
function toggleSubmenu(menuId) {
    let menu = document.getElementById(menuId);
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}
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
function atualizarVisibilidadeCurso(classeSelectId, containerId, cursoInputId) {
    const classeSelecionada = document.getElementById(classeSelectId).value;
    const cursoContainer = document.getElementById(containerId);
  
    if (["10ª Classe", "11ª Classe", "12ª Classe", "13ª Classe"].includes(classeSelecionada)) {
      cursoContainer.style.display = "block";
    } else {
      cursoContainer.style.display = "none";
      document.getElementById(cursoInputId).value = "";
    }
}




//-------------cadastro----------
document.addEventListener("DOMContentLoaded", function () {
    const telefoneInput = document.getElementById("telefone");
    telefoneInput.addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, "");
        if (this.value.length > 9) {
            this.value = this.value.slice(0, 9);
          }
    });
    const classeSelectCadastro = document.getElementById("classe2");
    classeSelectCadastro.addEventListener("change", () => {
      atualizarVisibilidadeCurso("classe2", "cursoContainer2", "curso2");
    });

    const form = document.getElementById("form-estudante");
    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const nome = document.getElementById("nome2").value.trim();
        const email = document.getElementById("encarregado_email").value.trim();
        const telefone = document.getElementById("telefone").value.trim();
        const classeSelecionada = document.getElementById("classe2").value;
        const curso = document.getElementById("curso2").value;
        const turma = document.getElementById("turma2").value;
        const dataNascimento = document.getElementById("data_nascimento2").value;
        const hoje = new Date().toISOString().split("T")[0];

       // Verifica se o nome está preenchido
if (!nome) {
    document.getElementById('mensagem').textContent = "Por favor, preencha o nome.";
    document.getElementById('mensagem').style.color = "red";
    return; // Impede envio
  }
  // Verifica se o email está no formato correto
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    document.getElementById('mensagem').textContent = "Informe um email válido.";
    document.getElementById('mensagem').style.color = "red";
    return; // Impede envio
  }
  // Verifica se o telefone tem exatamente 9 números
  if (telefone.length !== 9) {
    document.getElementById('mensagem').textContent = "Telefone deve ter exatamente 9 números.";
    document.getElementById('mensagem').style.color = "red";
    return; // Impede envio
  }
  // Verifica se a classe foi selecionada
  if (!classeSelecionada) {
    document.getElementById('mensagem').textContent = "Selecione a classe.";
    document.getElementById('mensagem').style.color = "red";
    return; // Impede envio
  }
  // Verifica se a turma foi preenchida
  if (!turma) {
    document.getElementById('mensagem').textContent = "Informe a turma.";
    document.getElementById('mensagem').style.color = "red";
    return; // Impede envio
  }
  // Verifica se a data de nascimento foi preenchida
  if (!dataNascimento) {
    document.getElementById('mensagem').textContent = "Informe a data de nascimento.";
    document.getElementById('mensagem').style.color = "red";
    return; // Impede envio
  }
  // Verifica se a data de nascimento não é maior que a data de hoje
  if (dataNascimento > hoje) {
    document.getElementById('mensagem').textContent = "Data de nascimento não pode ser maior que hoje.";
    document.getElementById('mensagem').style.color = "red";
    return; // Impede envio
  }
  // Verifica se, para as classes 10ª, 11ª, 12ª ou 13ª, o curso foi selecionado
  if (["10ª Classe", "11ª Classe", "12ª Classe", "13ª Classe"].includes(classeSelecionada) && !curso) {
    document.getElementById('mensagem').textContent = `Por favor, selecione o curso para a ${classeSelecionada}.`;
    document.getElementById('mensagem').style.color = "red";
    return; // Impede envio
  }
  
        try {
            const formData = new FormData(this);
            const dados = Object.fromEntries(formData.entries());
            alert(JSON.stringify(dados, null, 2));
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


//----------atualizar estudnates/ encarregados-----------------
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
            
            exibirEstudantesAssociados(estudantes);

            document.getElementById("editar-encarregado").style.display = "block";
        });
    });
    function exibirEstudantesAssociados(estudantes) {
        const container = document.getElementById("estudantes-associados");
        container.innerHTML = "<h4>Estudantes Associados:</h4>";
    
        if (estudantes.length > 0) {
            estudantes.forEach(est => {
                const p = document.createElement("p");
                p.innerHTML = `
                    • ${est.nome} 
                    - Classe: ${est.classe || 'N/A'}, 
                    Turma: ${est.turma || 'N/A'}, 
                    Curso: ${est.curso || 'N/A'}
                `;
                container.appendChild(p);
            });
        } else {
            container.innerHTML += `<p style="color: gray;">Nenhum estudante associado.</p>`;
        }
    }
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
        const confirmDelete = confirm("Realmente quer enviar o link de reedifinicao de senha?");
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
    // Lista de classes que exigem curso
const classesComCurso = ["10ª Classe", "11ª Classe", "12ª Classe", "13ª Classe"];
// Função para verificar ao clicar no botão de editar
function verificarCursoAoEditar(classeSelecionada, curso) {
    const container = document.getElementById("cursoContainer");
    const campoCurso = document.getElementById("curso");

    if (classesComCurso.includes(classeSelecionada)) {
        container.style.display = "block";
        campoCurso.value = curso || "";
    } else {
        container.style.display = "none";
        campoCurso.value = "";
    }
}
// Função para lidar com a mudança de classe
function verificarCursoAoAlterarClasse(classeSelecionada) {
    const container = document.getElementById("cursoContainer");
    const campoCurso = document.getElementById("curso");

    if (classesComCurso.includes(classeSelecionada)) {
        container.style.display = "block";
    } else {
        container.style.display = "none";
        campoCurso.value = "";
    }
}
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

            verificarCursoAoEditar(classe, curso);
            // Mostrar a seção
            showSection("edit_studentes");
        });
    });
    const classeSelectEdicao = document.getElementById("classe");
    classeSelectEdicao?.addEventListener("change", function () {
        verificarCursoAoAlterarClasse(this.value);
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


//----------criar documnetos-------------------
let contador = 0;
function atualizarTituloFormulario() {
    const tipo = document.getElementById("tipoDocumento").value;
    const formTitle = document.getElementById("formTitle");
    const botaoSubmit = document.getElementById("botaoSubmit");

    if (tipo === "contrato") {
        formTitle.textContent = "Criar Novo Contrato";
        botaoSubmit.textContent = "Criar Contrato";
    } else if (tipo === "comunicado") {
        formTitle.textContent = "Criar Novo Comunicado";
        botaoSubmit.textContent = "Criar Comunicado";
    } else {
        formTitle.textContent = "Criar Novo Documento";
        botaoSubmit.textContent = "Criar Documento";
    }
  }
  function adicionarEspecificacao() {
  const container = document.getElementById('especificacoesContainer');
  const div = document.createElement('div');
  div.classList.add('especificacao');
  div.setAttribute('data-id', contador);

  div.innerHTML = `
    <div class="form-group">
      <label>Classe</label>
      <select name="classe_${contador}" onchange="verificarCurso(this, ${contador})" required>
        <option value="">Selecione a Classe</option>
        <option value="1ª Classe">1ª Classe</option>
                    <option value="2ª Classe">2ª Classe</option>
                    <option value="3ª Classe">3ª Classe</option>
                    <option value="4ª Classe">4ª Classe</option>
                    <option value="5ª Classe">5ª Classe</option>
                    <option value="6ª Classe">6ª Classe</option>
                    <option value="7ª Classe">7ª Classe</option>
                    <option value="8ª Classe">8ª Classe</option>
                    <option value="9ª Classe">9ª Classe</option>
                    <option value="10ª Classe">10ª Classe</option>
                    <option value="11ª Classe">11ª Classe</option>
                    <option value="12ª Classe">12ª Classe</option>
                    <option value="13ª Classe">13ª Classe</option>
      </select>
    </div>

    <div class="form-group hidden" id="cursoContainer-${contador}">
      <label>Curso</label>
      <select name="curso_${contador}">
        <option value="">Selecione o Curso</option>
        <option value="todos">Todos</option>
        <option value="Ciências Exatas">Ciências Exatas</option>
        <option value="Ciências Biológicas">Ciências Biológicas</option>
        <option value="Ciências Humanas">Ciências Humanas</option>
        <option value="Eletrotecnia">Eletrotecnia</option>
        <option value="Informática">Informática</option>
        <option value="Construção Civil">Construção Civil</option>
        <option value="Gestão e Economia">Gestão e Economia</option>
      </select>
    </div>

    <div class="form-group">
      <label>Turma</label>
      <select name="turma_${contador}" required>
        <option value="">Selecione a Turma</option>
        <option value="todos">Todos</option>
        <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
      </select>
    </div>

    <button type="button" class="remove-btn" onclick="removerEspecificacao(this)">Remover</button>
  `;

  container.appendChild(div);

  // Resetar os selects
  const selects = div.querySelectorAll('select');
  selects.forEach(select => {
    select.selectedIndex = 0;
  });

  // Desmarcar o checkbox "enviarTodos"
  document.getElementById('enviarTodos').checked = false;

  contador++;
}
  function verificarCurso(select, id) {
    const value = select.value;
    const cursoDiv = document.getElementById(`cursoContainer-${id}`);
    if (value === "10ª Classe" || value === "11ª Classe" || value === "12ª Classe" || value === "13ª Classe") {
      cursoDiv.classList.remove("hidden");
    } else {
      cursoDiv.classList.add("hidden");
    }
  }
  function removerEspecificacao(botao) {
    const div = botao.parentElement;
    div.remove();
  }
  function coletarDadosContratos() {
    const tipoDocumento = document.getElementById('tipoDocumento').value;
    const titulo = document.getElementById('titulo').value;
    const conteudo = document.getElementById('conteudo').value;
    const enviarTodos = document.getElementById('enviarTodos').checked;
    const dataExpiracaoInput = document.getElementById('dataExpiracao');

    const especificacoes = [];

    document.querySelectorAll('.especificacao').forEach((div) => {
        const id = div.getAttribute('data-id');
        const classe = div.querySelector(`select[name="classe_${id}"]`).value;
        const curso = div.querySelector(`select[name="curso_${id}"]`).value;
        const turma = div.querySelector(`select[name="turma_${id}"]`).value;

        especificacoes.push({
            classe,
            curso: (["10ª Classe", "11ª Classe", "12ª Classe","13ª Classe"].includes(classe)) ? curso : null,
            turma
        });
    });

    return {
        tipoDocumento,
        titulo,
        conteudo,
        enviarParaTodos: enviarTodos,
        especificacoes,
        dataExpiracao: dataExpiracaoInput.value
    }
 }
  function
  document.getElementById('contratoForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const resposta = confirm("Realmente quer enviar o contrato aos encarregados?");
    
    if(resposta) {
        const tipoDocumento = document.getElementById('tipoDocumento').value;
        const titulo = document.getElementById('titulo').value;
        const conteudo = document.getElementById('conteudo').value;
        const enviarTodos = document.getElementById('enviarTodos').checked;
        const dataExpiracaoInput = document.getElementById('dataExpiracao');

        const especificacoes = [];

        document.querySelectorAll('.especificacao').forEach((div) => {
            const id = div.getAttribute('data-id');
            const classe = div.querySelector(`select[name="classe_${id}"]`).value;
            const curso = div.querySelector(`select[name="curso_${id}"]`).value;
            const turma = div.querySelector(`select[name="turma_${id}"]`).value;

            especificacoes.push({
                classe,
                curso: (["10ª Classe", "11ª Classe", "12ª Classe","13ª Classe"].includes(classe)) ? curso : null,
                turma
            });
        });
        if (!enviarTodos  && especificacoes.length === 0) {
            alert("Você deve selecionar pelo menos uma raiz ou marcar a opção de enviar para todos.");
            return; // Impede o envio
        }
        if (!dataExpiracaoInput.value) {
            alert("A data de expiração é obrigatória para todos os documentos.");
            return;
        }

        const dadosContrato = {
            tipoDocumento,
            titulo,
            conteudo,
            enviarParaTodos: enviarTodos,
            especificacoes,
            dataExpiracao: dataExpiracaoInput.value
        };

        try {
            const response = await fetch('/enviar_documento', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosContrato)
            });

            if (!response.ok) {
                throw new Error('Falha ao enviar o contrato.');
            }

            const data = await response.json();

            if (data.sucesso) {
                alert(data.motivo);
                location.reload();
            } else {
                alert("Erro ao enviar o contrato.");
            }
        } catch (err) {
            console.error('Erro ao enviar contrato:', err);
            alert("Erro ao enviar contrato.");
        }
    }
});
document.getElementById('enviarTodos').addEventListener('change', function () {
  const container = document.getElementById('especificacoesContainer');

  if (this.checked) {
    // Apaga todas as raízes existentes
    container.innerHTML = '';
    contador = 0;
  }
});
document.addEventListener('DOMContentLoaded', () => {
    const dataExpiracaoInput = document.getElementById('dataExpiracao');
    const hoje = new Date().toISOString().split('T')[0];
    if (dataExpiracaoInput) {
      dataExpiracaoInput.setAttribute('min', hoje);
    }
});