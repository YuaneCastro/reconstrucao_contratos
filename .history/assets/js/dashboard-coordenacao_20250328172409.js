// Função para mostrar seção
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

// Logout - limpa cookie e redireciona
document.getElementById('logout-button').addEventListener('click', () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = '/login-cordenacao';
});

// Validação ao carregar a página
document.addEventListener("DOMContentLoaded", function () {
    const telefoneInput = document.getElementById("telefone");
    const formulario = document.getElementById("formulario");
    const submitButton = document.getElementById("submit-button");

    // Formatar campo telefone
    telefoneInput.addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, "");
    });

    // Desabilitar botão até formulário ser válido
    formulario.addEventListener("input", function () {
        submitButton.disabled = !formulario.checkValidity();
    });

    // Garante que começa desabilitado
    submitButton.disabled = true;
});

// Mostrar ou ocultar campo curso conforme classe selecionada
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

// Validação final antes de submeter
function validarFormulario() {
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("encarregado_email").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const classeSelecionada = document.getElementById("classe").value;
    const curso = document.getElementById("curso").value;

    if (!nome || !email || !telefone) {
        alert("Todos os campos são obrigatórios.");
        return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
        alert("E-mail inválido.");
        return false;
    }

    if (telefone.length < 9) {
        alert("Número de telefone inválido.");
        return false;
    }

    if (["10ª Classe", "11ª Classe", "12ª Classe", "13ª Classe"].includes(classeSelecionada) && !curso) {
        alert("Por favor, selecione um curso antes de continuar.");
        return false;
    }

    return true;
}
