function showSection(sectionId) {
    let sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    document.getElementById(sectionId).classList.add('active');
}
function showGuardians() {
    document.querySelector('.main-content').innerHTML = `
        <h2>Lista de Encarregados</h2>
        <table border="1" width="100%">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Telefone</th>
                    <th>Código</th>
                    <th>Criado em</th>
                    <th>Atualizado em</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td>João Santos</td>
                    <td>joao@email.com</td>
                    <td>+244923456789</td>
                    <td>123456</td>
                    <td>2025-03-25 10:30:00</td>
                    <td>2025-03-25 11:00:00</td>
                    <td>
                        <span style="color:blue; cursor:pointer;">✏️</span>
                        <span style="color:red; cursor:pointer;">🗑️</span>
                    </td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>Maria Oliveira</td>
                    <td>maria@gmail.com</td>
                    <td>+244911234567</td>
                    <td>654321</td>
                    <td>2025-03-24 08:20:15</td>
                    <td>2025-03-25 09:15:30</td>
                    <td>
                        <span style="color:blue; cursor:pointer;">✏️</span>
                        <span style="color:red; cursor:pointer;">🗑️</span>
                    </td>
                </tr>
                <tr>
                    <td>3</td>
                    <td>Pedro Lima</td>
                    <td>pedro.lima@teste.com</td>
                    <td>912345678</td>
                    <td>-</td>
                    <td>2025-03-23 14:45:50</td>
                    <td>2025-03-24 16:10:10</td>
                    <td>
                        <span style="color:blue; cursor:pointer;">✏️</span>
                        <span style="color:red; cursor:pointer;">🗑️</span>
                    </td>
                </tr>
            </tbody>
        </table>
    `;
}