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

document.addEventListener("DOMContentLoaded", function() {
    const nomeInput = document.getElementById("nome");
    const mensagem = document.getElementById("mensagem");
    const botaoCadastro = document.getElementById("botao_cadastro");

    nomeInput.addEventListener("input", async function() {
        const nome = nomeInput.value.trim();
        if (nome.length > 0) {
            const response = await fetch(`/verificar-estudante/${nome}`);
            const data = await response.json();
            if (data.existente) {
                mensagem.textContent = "Já existe um estudante cadastrado com esse nome.";
                botaoCadastro.disabled = true;
            } else {
                mensagem.textContent = "";
                botaoCadastro.disabled = false;
            }
        }
    });
});