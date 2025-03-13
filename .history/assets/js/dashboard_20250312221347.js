document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("logModal");
    const btn = document.getElementById("abrirModal");
    const closeBtn = document.querySelector(".close");
    const tbody = document.getElementById("logTableBody");

    btn.addEventListener("click", async () => {
        try {
            const res = await fetch('/log-atividades');
            const logs = await res.json();

            tbody.innerHTML = "";
            logs.forEach(log => {
                const row = document.createElement("tr");
                row.innerHTML = `<td>${log.atividade}</td><td>${log.data}</td>`;
                tbody.appendChild(row);
            });

            modal.style.display = "block";
        } catch (error) {
            console.error("Erro ao carregar logs:", error);
        }
    });

    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });
});
