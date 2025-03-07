document.addEventListener("DOMContentLoaded", function () {
    // Referências aos elementos do modal e botões
    const updateModal = document.getElementById("updateModal");
    const updateInfoLink = document.getElementById("update-info-link");
    const updateForm = document.getElementById("update-form");
    const updateMessage = document.getElementById("update-message");
    const closeButtons = document.querySelectorAll(".close");

    // Abre o modal de atualização
    updateInfoLink.addEventListener("click", function () {
        updateModal.style.display = "block";
    });

    // Fecha os modais ao clicar no "X"
    closeButtons.forEach(btn => {
        btn.addEventListener("click", function () {
            btn.closest(".modal").style.display = "none";
        });
    });

    // Fecha o modal ao clicar fora dele
    window.addEventListener("click", function (event) {
        if (event.target.classList.contains("modal")) {
            event.target.style.display = "none";
        }
    });

    // Captura o evento de envio do formulário
    updateForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Evita o recarregamento da página

        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;

        try {
            const response = await fetch("/configuracoes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, email }) // Enviando os dados em JSON
            });

            const data = await response.json();

            if (response.ok) {
                updateMessage.style.display = "block";
                updateMessage.textContent = "Dados atualizados com sucesso!";
                updateModal.style.display = "none"; // Fecha o modal após a atualização
            } else {
                alert(data.mensagem || "Erro ao atualizar os dados.");
            }
        } catch (error) {
            console.error("Erro na atualização:", error);
            alert("Ocorreu um erro. Tente novamente.");
        }
    });
});
