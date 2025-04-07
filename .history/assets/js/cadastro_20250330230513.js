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
            const response = await fetch('/cadastro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });

            const resultado = await response.json();

            if (resultado.sucesso) {
                document.getElementById('mensagem').textContent = "Estudante cadastrado com sucesso!";
                document.getElementById('mensagem').style.color = "green";
            } else {
                document.getElementById('mensagem').textContent = "Erro: " + resultado.motivo;
                document.getElementById('mensagem').style.color = "red";
            }
        } catch (error) {
            console.error('Erro ao cadastrar estudante:', error);
            document.getElementById('mensagem').textContent = "Erro ao conectar ao servidor.";
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
    if (validarFormulario()) {
        botaoCadastro.disabled = false;
    } else {
        botaoCadastro.disabled = true;
    }
}

document.getElementById('form-estudante').addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const dados = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/cadastro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        const resultado = await response.json();

        if (resultado.sucesso) {
            document.getElementById('mensagem').textContent = "Estudante cadastrado com sucesso!";
            document.getElementById('mensagem').style.color = "green";
        } else {
            document.getElementById('mensagem').textContent = "Erro: " + resultado.motivo;
            document.getElementById('mensagem').style.color = "red";
        }
    } catch (error) {
        console.error('Erro ao cadastrar estudante:', error);
        document.getElementById('mensagem').textContent = "Erro ao conectar ao servidor.";
        document.getElementById('mensagem').style.color = "red";
    }
});
