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
    const botaoCadastro = document.getElementById("botao_cadastro");

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
function usarEncarregado(guardiao) {
    // Preenche os inputs com os dados
    document.getElementById('u-nome').value = guardiao.nome;
    document.getElementById('u-email').value = guardiao.email;
    document.getElementById('u-telefone').value = guardiao.telefone;

    // Esconde a seção atual e mostra a nova
    document.querySelectorAll('.section').forEach(sec => sec.style.display = 'none');
    document.getElementById('usar-encarregado').style.display = 'block';
}

function voltarParaGuardians() {
    // Esconde a seção de uso e mostra os encarregados
    document.getElementById('usar-encarregado').style.display = 'none';
    document.getElementById('guardians').style.display = 'block';
}