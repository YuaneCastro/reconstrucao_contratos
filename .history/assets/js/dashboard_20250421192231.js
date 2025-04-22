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

  const conteudoContrato = document.getElementById('conteudoContrato');
  const deveAssinar = tipo === 'Contrato';
  conteudoContrato.innerHTML = `
    <h4>${titulo}</h4>
    <p><strong>Tipo:</strong> ${tipo}</p>
    <p><strong>Data de Criação:</strong> ${new Date(dataEmissao).toISOString().split('T')[0]}</p>
    <p><strong>Data de Expiração:</strong> ${dataExpiracao ? new Date(dataExpiracao).toISOString().split('T')[0] : 'Não definida'}</p>
    <p><strong>Descrição:</strong> ${descricao}</p>
  `;

  showSection('visualizacaoContrato');
}