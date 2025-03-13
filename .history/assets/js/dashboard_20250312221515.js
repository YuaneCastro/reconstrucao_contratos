document.addEventListener('DOMContentLoaded', () => {
    carregarLogsAtividades(); // Carrega os logs ao carregar a página

    const logModal = document.getElementById("logModal");
    const logTableBody = document.getElementById("logTableBody");
    const logLink = document.getElementById("log-atividades-link");

    if (logLink) {
        logLink.addEventListener("click", async () => {
            await carregarLogsAtividades();
            logModal.style.display = "block";
        });
    }

    document.querySelectorAll(".close").forEach(button => {
        button.addEventListener('click', () => logModal.style.display = "none");
    });

    window.addEventListener("click", event => {
        if (event.target.classList.contains("modal")) {
            event.target.style.display = "none";
        }
    });

    async function carregarLogsAtividades() {
        try {
            const response = await fetch('/log-atividades');
            if (!response.ok) throw new Error('Erro ao carregar logs');

            const logs = await response.json();
            logTableBody.innerHTML = logs.map(log => `
                <tr>
                    <td class="tipo-${log.tipo_atividade.toLowerCase()}">${log.tipo_atividade}</td>
                    <td>${new Date(log.data_atividade).toLocaleString()}</td>
                </tr>
            `).join('');
        } catch (error) {
            console.error("Erro ao carregar logs:", error);
        }
    }
});
