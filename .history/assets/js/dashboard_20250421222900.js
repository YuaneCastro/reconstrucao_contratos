function showSection(id) {
    document.querySelectorAll('.section').forEach(section => {
      section.classList.remove('active');
    });
    document.getElementById(id).classList.add('active');
  }
  document.getElementById('logout-button')?.addEventListener('click', () => {
    const a = window.confirm('Pretende realmente fazer logout ?');
    if(a == true){
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = '/login';
    }
});
function handleViewContract(button) {
  const id = button.getAttribute('data-id');
  const titulo = button.getAttribute('data-titulo');
  const tipo = button.getAttribute('data-tipo');
  const dataEmissao = button.getAttribute('data-data_emissao');
  const dataExpiracao = button.getAttribute('data-data_expiracao');
  const descricao = button.getAttribute('data-descricao');

  let html = `
  <div class="contrato-visual">
    <h2 style="text-align: center;">${titulo}</h2>
    <p><strong>Tipo:</strong> ${tipo}</p>
    <p><strong>Data de Criação:</strong> ${new Date(dataEmissao).toLocaleDateString('pt-BR')}</p>
    <p><strong>Data de Expiração:</strong> ${dataExpiracao ? new Date(dataExpiracao).toLocaleDateString('pt-BR') : 'Não definida'}</p>
    <hr>
    <p style="margin-top: 20px;">${descricao}</p>
  </div>`;

    if (tipo == 'Contrato') {
      html += `
        <div style="text-align: center; margin-top: 30px;">
          <button class="btn-assinar" onclick="handleAssinarContrato('${id}')">
            ✍️ Assinar Contrato
          </button>
        </div>`;
    }
    html += `</div>`;
    const conteudoContrato = document.getElementById('conteudoContrato');
    conteudoContrato.innerHTML = html;
  showSection('visualizacaoContrato');
}