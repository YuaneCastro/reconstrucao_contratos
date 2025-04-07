function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}
document.getElementById('logout-button').addEventListener('click', () => {
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
};

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
};
let encarregadoInfo = {};
const emailInput = document.getElementById('encarregado_email');
const nomeInput = document.getElementById('encarregado_nome');
const telefoneInput = document.getElementById('telefone');
const aviso = document.getElementById('aviso');
const botaoCadastrar = document.getElementById('btn-cadastrar');

// Inicialmente desativa o botão
botaoCadastrar.disabled = true;

async function buscarEncarregado() {
    const email = emailInput.value.trim();

    if (email) {
        try {
            const response = await fetch(`/buscar-encarregado-email?email=${email}`);
            if (response.ok) {
                const data = await response.json();
                encarregadoInfo = data;
                aviso.textContent = '';
            } else {
                encarregadoInfo = {};
                aviso.textContent = 'Nenhum encarregado encontrado com este email.';
            }
        } catch (error) {
            console.error(error);
            aviso.textContent = 'Erro ao verificar email.';
        }
    } else {
        encarregadoInfo = {};
    }
    validarDados();
}

function validarDados() {
    const nomeDigitado = nomeInput.value.trim();
    const telefoneDigitado = telefoneInput.value.trim();

    if (encarregadoInfo.nome && encarregadoInfo.telefone) {
        if (nomeDigitado === encarregadoInfo.nome && telefoneDigitado === encarregadoInfo.telefone) {
            aviso.textContent = '';
            botaoCadastrar.disabled = false;
        } else {
            aviso.textContent = 'O nome ou telefone não correspondem ao email digitado.';
            botaoCadastrar.disabled = true;
        }
    } else {
        botaoCadastrar.disabled = true;
    }
}

// Eventos
emailInput.addEventListener('blur', buscarEncarregado);
nomeInput.addEventListener('input', validarDados);
telefoneInput.addEventListener('input', validarDados);
