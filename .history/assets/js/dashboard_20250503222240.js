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
  // Limpar o conteúdo da div antes de adicionar os novos dados
  const conteudoContrato = document.getElementById('conteudoContrato');
  conteudoContrato.innerHTML = '';

  // Obter os dados do botão
  const id = button.getAttribute('data-id');
  const titulo = button.getAttribute('data-titulo');
  const tipo = button.getAttribute('data-tipo');
  const dataEmissao = button.getAttribute('data-data_emissao');
  const dataExpiracao = button.getAttribute('data-data_expiracao');
  const descricao = button.getAttribute('data-descricao');

  // Gerar o conteúdo HTML do contrato ou comunicado
  let html = `
  <div class="contrato-visual">
    <h2 style="text-align: center;">${titulo}</h2>
    <p><strong>Tipo:</strong> ${tipo}</p>
    <p><strong>Data de Criação:</strong> ${new Date(dataEmissao).toLocaleDateString('pt-BR')}</p>
    <p><strong>Data de Expiração:</strong> ${dataExpiracao ? new Date(dataExpiracao).toLocaleDateString('pt-BR') : 'Não definida'}</p>
    <hr>
    <p style="margin-top: 20px;">${descricao}</p>
  </div>`;

  // Adiciona o botão de assinar somente se for um contrato
  if (tipo.toLowerCase() === 'contrato') {
    html += `
      <div style="text-align: center; margin-top: 30px;">
        <button class="btn-assinar" onclick="handleAssinarContrato('${id}')">
          ✍️ Assinar Contrato
        </button>
      </div>`;
  }

  // Atualiza o conteúdo da div com o novo HTML
  conteudoContrato.innerHTML = html;

  // Exibe a seção de visualização de contrato
  showSection('visualizacaoContrato');
}
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.documento-card');
  const detalhesSection = document.getElementById('detalhes-documento');
  const conteudoDetalhes = document.getElementById('conteudo-detalhes');
  const fecharBtn = document.getElementById('fechar-detalhes');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const titulo = card.getAttribute('data-titulo');
      const tipo = card.getAttribute('data-tipo');
      const emissao = card.getAttribute('data-emissao');
      const expiracao = card.getAttribute('data-expiracao');
      const descricao = card.getAttribute('data-descricao');

      conteudoDetalhes.innerHTML = `
        <p><strong>Título:</strong> ${titulo}</p>
        <p><strong>Tipo:</strong> ${tipo}</p>
        <p><strong>Data de Criação:</strong> ${emissao}</p>
        <p><strong>Data de Expiração:</strong> ${expiracao}</p>
        <p><strong>Descrição:</strong> ${descricao}</p>
        <p>Aqui você pode adicionar mais informações, arquivos, ou botões de ação relacionados a esse documento.</p>
      `;

      detalhesSection.style.display = 'block';
      detalhesSection.scrollIntoView({ behavior: 'smooth' });
    });
  });

  fecharBtn.addEventListener('click', () => {
    detalhesSection.style.display = 'none';
  });
});