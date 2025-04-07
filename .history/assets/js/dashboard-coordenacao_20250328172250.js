document.addEventListener("DOMContentLoaded", function () {
    const nome = document.getElementById("nome");
    const email = document.getElementById("encarregado_email");
    const telefone = document.getElementById("telefone");
    const classe = document.getElementById("classe");
    const curso = document.getElementById("curso");
    const cursoContainer = document.getElementById("cursoContainer");
    const submitButton = document.getElementById("submit-button");
    const formulario = document.getElementById("formulario");

    telefone.addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, "");
    });

    classe.addEventListener("change", function () {
        if (["10ª Classe", "11ª Classe", "12ª Classe", "13ª Classe"].includes(classe.value)) {
            cursoContainer.style.display = "block";
            curso.setAttribute("required", "true");
        } else {
            cursoContainer.style.display = "none";
            curso.removeAttribute("required");
            curso.value = "";
        }
        validarCampos();
    });

    formulario.addEventListener("input", validarCampos);

    function validarCampos() {
        const nomeVal = nome.value.trim();
        const emailVal = email.value.trim();
        const telefoneVal = telefone.value.trim();
        const classeVal = classe.value;
        const cursoVal = curso.value;

        let valido = nomeVal && emailVal && telefoneVal.length >= 9 && /^\S+@\S+\.\S+$/.test(emailVal);

        if (["10ª Classe", "11ª Classe", "12ª Classe", "13ª Classe"].includes(classeVal)) {
            valido = valido && cursoVal;
        }

        submitButton.disabled = !valido;
    }

    formulario.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!submitButton.disabled) {
            alert("Formulário enviado com sucesso!");
            formulario.reset();
            submitButton.disabled = true;
            cursoContainer.style.display = "none";
        }
    });
});