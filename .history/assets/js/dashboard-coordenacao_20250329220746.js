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

    form.addEventListener("submit", function (event) {
        if (!validarFormulario()) {
            event.preventDefault();
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
    if (validarFormulario()) {
        botaoCadastro.disabled = false;
    } else {
        botaoCadastro.disabled = true;
    }
}

document.getElementById('form-estudante').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = e.target;
    const dados = {
        nome: form.nome.value,
        data_nascimento: form.data_nascimento.value,
        classe: form.classe.value,
        turma: form.turma.value,
        curso: form.curso.value,
        encarregado_nome: form.encarregado_nome.value,
        encarregado_email: form.encarregado_email.value,
        telefone: form.telefone.value
    };

    try {
        const token = localStorage.getItem('token');
        window.alert("ok");
        const resposta = await fetch('/dashboard-cordenacao', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(dados)
        });
        window.alert("ok");
        const resultado = await resposta.json();

        if (resultado.sucesso) {
            p.textContent = "✅ Estudante cadastrado com sucesso!";
            p.style.color = 'green';
        } else {
            let mensagem = '';
            if (resultado.motivo === "estudante_existente") {
                mensagem = "❗ Este estudante já foi cadastrado.";
            } else if (resultado.motivo === "encarregado_conflito") {
                mensagem = "❗ Dados do encarregado estão inconsistentes.";
            } else if (resultado.motivo === "erro_interno") {
                mensagem = "❗ Ocorreu um erro interno. Tente novamente.";
            } else {
                mensagem = "❗ Erro desconhecido.";
            }
            p.textContent = mensagem;
            p.style.color = 'red';
        }

    } catch (err) {
        p.textContent = "❗ Erro de comunicação com o servidor.";
        p.style.color = 'red';
    }
});