// Confirmlog.js

window.onload = function () {
    // Obter dados da sessão se disponíveis
    const email = '<%= session.email %>';
    const confirmationCode = '<%= session.confirmationCode %>';

    if (email && confirmationCode) {
        document.getElementById('emailDisplay').innerText = `Email: ${email}`;
        document.getElementById('codeDisplay').innerText = `Código: ${confirmationCode}`;
    } else {
        alert('Erro: Dados de confirmação não encontrados.');
    }
};
