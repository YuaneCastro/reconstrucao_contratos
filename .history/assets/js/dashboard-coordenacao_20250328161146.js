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
const form = document.getElementById('form-estudante');
const aviso = document.getElementById('aviso');
const botao = document.getElementById('btn-cadastrar');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    aviso.textContent = '';
    botao.disabled = true;

    try {
        const response = await fetch('/cadastrar', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.sucesso) {
            aviso.style.color = 'green';
            aviso.textContent = data.mensagem;
            // window.location.href = '/dashboard-cordenacao'; // opcional
        } else {
            aviso.style.color = 'red';
            aviso.textContent = data.mensagem;
            botao.disabled = false;
        }
    } catch (error) {
        console.error(error);
        aviso.style.color = 'red';
        aviso.textContent = 'Erro ao cadastrar estudante.';
        botao.disabled = false;
    }
});

