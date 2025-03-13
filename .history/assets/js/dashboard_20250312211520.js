document.addEventListener('DOMContentLoaded', () => {
    carregarContratos();
    carregarLogsAtividades();

    function openModal(modal) {
        modal.style.display = "block";
    }

    function closeModal(modal) {
        modal.style.display = "none";
    }

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

    const closeButtons = document.querySelectorAll(".close");
    
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

    closeButtons.forEach(button => {
        button.addEventListener('click', () => closeModal(button.closest(".modal")));
    });

    window.addEventListener('click', event => {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target);
        }
    });

    const form = document.getElementById('update-form');
    const messageDiv = document.getElementById('update-message');
    const closeButton = document.querySelector('.close');

    form.addEventListener('submit', async event => {
        event.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/configuracoes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            messageDiv.innerText = result.message || 'Erro ao atualizar usuário';
            messageDiv.style.color = response.ok ? 'green' : 'red';
            closeButton.style.display = 'none';

            setTimeout(() => {
                messageDiv.innerText = '';
                closeButton.style.display = 'block';
            }, 3000);
        } catch {
            messageDiv.innerText = 'Erro ao atualizar usuário';
            messageDiv.style.color = 'red';
        }
    });

    document.getElementById('update-back-button').addEventListener('click', () => closeModal(modais.update));
    document.getElementById('contrato-back-button').addEventListener('click', () => closeModal(modais.contrato));
    document.getElementById('logs-back-button').addEventListener('click', () => closeModal(modais.log));
    document.getElementById('back-button').addEventListener('click', () => closeModal(modais.help));
    
    async function carregarLogsAtividades() {
        try {
            const response = await fetch('/log-atividades');
            if (!response.ok) throw new Error('Erro ao carregar logs');

            const logs = await response.json();
            const logTableBody = document.getElementById('logTableBody');
            logTableBody.innerHTML = logs.map(log => `
                <tr>
                    <td class="tipo-${log.tipo_atividade.toLowerCase()}">${log.tipo_atividade}</td>
                    <td>${new Date(log.data_atividade).toLocaleString()}</td>
                </tr>`).join('');
        } catch (error) {
            console.error(error);
        }
    }

    async function carregarContratos() {
        try {
            const response = await fetch('/contratos');
            if (!response.ok) throw new Error('Erro ao carregar contratos');

            const contratos = await response.json();
            const contratosList = document.getElementById('contratos-list');
            contratosList.innerHTML = contratos.map(contrato => `
                <div class='contrato-item'>
                    <strong>${contrato.titulo}</strong> - Criado em ${new Date(contrato.data_criacao).toLocaleDateString()}
                    <p>Outras informações do contrato...</p>
                </div>
            `).join('');
        } catch (error) {
            console.error(error);
        }
    }

    document.getElementById('next-button').addEventListener('click', () => {
        alert('Próxima etapa do contrato');
    });
});
