document.addEventListener('DOMContentLoaded', () => {
    carregarContratos();
    carregarLogsAtividades();

    const modais = {
        log: document.getElementById("logModal"),
        contrato: document.getElementById("contratoModal"),
        help: document.getElementById("helpModal"),
        update: document.getElementById("updateModal")
    };

    const links = {
        log: document.getElementById("log-atividades-link"),
        contrato: document.getElementById("criar-contrato-link"),
        manageAccount: document.getElementById("manage-account-link")
    };

    document.getElementById('logout-button').addEventListener('click', () => {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = '/logout';
    });

    links.log.addEventListener('click', async () => {
        openModal(modais.log);
        await carregarLogsAtividades();
    });

    links.contrato.addEventListener('click', () => openModal(modais.contrato));
    links.manageAccount.addEventListener('click', () => openModal(modais.help));

    document.querySelectorAll(".close").forEach(button => {
        button.addEventListener('click', () => closeModal(button.closest(".modal")));
    });

    window.addEventListener('click', event => {
        if (event.target.classList.contains('modal')) closeModal(event.target);
    });

    document.getElementById('update-form').addEventListener('submit', async event => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/configuracoes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            mostrarMensagem(result.message || 'Erro ao atualizar usuário', response.ok);
        } catch {
            mostrarMensagem('Erro ao atualizar usuário', false);
        }
    });

    document.querySelectorAll("[id$='-back-button']").forEach(button => {
        button.addEventListener('click', () => closeModal(button.closest(".modal")));
    });

    async function carregarLogsAtividades() {
        try {
            const response = await fetch('/log-atividades');
            if (!response.ok) throw new Error('Erro ao carregar logs');

            const logs = await response.json();
            const logTableBody = document.getElementById('logTableBody');
            logTableBody.innerHTML = "";

            if (logs.length === 0) {
                logTableBody.innerHTML = "<tr><td colspan='2'>Nenhuma atividade registrada.</td></tr>";
            } else {
                logs.forEach(log => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td class="tipo-${log.tipo_atividade.toLowerCase()}">${log.tipo_atividade} - ${log.descricao}</td>
                        <td>${new Date(log.data_atividade).toLocaleString()}</td>
                    `;
                    logTableBody.appendChild(row);
                });
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function carregarContratos() {
        try {
            const response = await fetch('/contratos');
            if (!response.ok) throw new Error('Erro ao carregar contratos');

            const contratos = await response.json();
            document.getElementById('contratos-list').innerHTML = contratos.map(contrato => `
                <div class='contrato-item'>
                    <strong>${contrato.titulo}</strong> - Criado em ${new Date(contrato.data_criacao).toLocaleDateString()}
                    <p>Outras informações do contrato...</p>
                </div>
            `).join('');
        } catch (error) {
            console.error(error);
        }
    }

    function openModal(modal) { modal.style.display = "block"; }
    function closeModal(modal) { modal.style.display = "none"; }
    function mostrarMensagem(mensagem, sucesso) {
        const messageDiv = document.getElementById('update-message');
        messageDiv.innerText = mensagem;
        messageDiv.style.color = sucesso ? 'green' : 'red';
        messageDiv.style.display = 'block';
        setTimeout(() => messageDiv.style.display = 'none', 3000);
    }

    document.getElementById('next-button').addEventListener('click', () => alert('Próxima etapa do contrato'));
});
