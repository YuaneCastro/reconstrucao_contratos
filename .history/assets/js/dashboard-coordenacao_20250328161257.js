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
    aviso.textContent = '';
    aviso.style.color = '';
    botao.disabled = true;
    botao.textContent = 'Verificando...';

    const formData = new FormData(form);

    try {
        const response = await fetch('/cadastrar', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const data = await response.text();
            if (data.includes('Estudante')) {
                aviso.style.color = 'green';
                aviso.textContent = 'Estudante cadastrado com sucesso!';
                // Se quiser redirecionar:
                // window.location.href = '/dashboard-cordenacao';
            } else {
                aviso.style.color = 'red';
                aviso.textContent = data;
                botao.disabled = false;
                botao.textContent = 'Cadastrar Estudante';
            }
        } else {
            const errorText = await response.text();
            aviso.style.color = 'red';
            aviso.textContent = errorText;
            botao.disabled = false;
            botao.textContent = 'Cadastrar Estudante';
        }
    } catch (error) {
        console.error(error);
        aviso.style.color = 'red';
        aviso.textContent = 'Erro ao cadastrar estudante.';
        botao.disabled = false;
        botao.textContent = 'Cadastrar Estudante';
    }
});