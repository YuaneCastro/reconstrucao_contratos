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
        const cursoContainer = document.getElementById('cursoContainer');
        const submitBtn = document.querySelector('.btn-cadastrar');

        const verificarClasse = () => {
            const classe = document.getElementById('classe').value;
            if (classe === '10ª Classe' || classe === '11ª Classe' || classe === '12ª Classe' || classe === '13ª Classe') {
                cursoContainer.style.display = 'block';
            } else {
                cursoContainer.style.display = 'none';
            }
            validarCampos();
        }

        document.getElementById('classe').addEventListener('change', verificarClasse);

        const validarCampos = () => {
            const nome = document.getElementById('nome').value.trim();
            const data_nascimento = document.getElementById('data_nascimento').value.trim();
            const classe = document.getElementById('classe').value.trim();
            const turma = document.getElementById('turma').value.trim();
            const encarregado_nome = document.getElementById('encarregado_nome').value.trim();
            const encarregado_email = document.getElementById('encarregado_email').value.trim();
            const telefone = document.getElementById('telefone').value.trim();

            let curso = '';
            if (classe === '10ª Classe' || classe === '11ª Classe' || classe === '12ª Classe' || classe === '13ª Classe') {
                curso = document.getElementById('curso').value.trim();
            }

            const camposPreenchidos = nome && data_nascimento && classe && turma && encarregado_nome && encarregado_email && telefone && (cursoContainer.style.display === 'none' || curso);

            submitBtn.disabled = !camposPreenchidos;
        }

        form.addEventListener('input', validarCampos);

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const dados = {
                nome: document.getElementById('nome').value.trim(),
                data_nascimento: document.getElementById('data_nascimento').value.trim(),
                classe: document.getElementById('classe').value.trim(),
                turma: document.getElementById('turma').value.trim(),
                curso: document.getElementById('curso').value.trim(),
                encarregado_nome: document.getElementById('encarregado_nome').value.trim(),
                encarregado_email: document.getElementById('encarregado_email').value.trim(),
                telefone: document.getElementById('telefone').value.trim(),
            };

            try {
                const response = await fetch('/cadastro', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dados)
                });

                const data = await response.json();

                if (data.sucesso === false) {
                    aviso.textContent = data.mensagem;
                    aviso.style.color = 'red';
                } else {
                    aviso.textContent = 'Estudante cadastrado com sucesso!';
                    aviso.style.color = 'green';
                    form.reset();
                    cursoContainer.style.display = 'none';
                    submitBtn.disabled = true;
                }
            } catch (error) {
                console.error(error);
                aviso.textContent = 'Erro ao cadastrar estudante.';
                aviso.style.color = 'red';
            }
        });
