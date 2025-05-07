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
  const titulo = button.getAttribute('data-titulo');
  const tipo = button.getAttribute('data-tipo');
  const dataEmissao = button.getAttribute('data-data_emissao');
  const dataExpiracao = button.getAttribute('data-data_expiracao');
  const descricao = button.getAttribute('data-descricao');
  const nome = button.getAttribute('data-nome');

  const assinatura_doc_id = button.getAttribute('data-id');
  const encarregado_id = button.getAttribute('data-id_encarregado');
  const estudante_id = button.getAttribute('data-id_estudante');

  // Gerar o conteúdo HTML do contrato ou comunicado
  let html = `
  <div class="contrato-visual">
    <h2 style="text-align: center;">${titulo}</h2>
    <p><strong>Nome:</strong> ${nome}</p>
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
        <button class="btn-assinar" 
        data-id="${assinatura_doc_id}"
        data-id_encarregado="${encarregado_id}"
        data-id_estudante="${estudante_id}"
        onclick="handleAssinarContrato(this)">
          ✍️ Assinar Contrato
        </button>
      </div>`;
  }

  // Atualiza o conteúdo da div com o novo HTML
  conteudoContrato.innerHTML = html;

  // Exibe a seção de visualização de contrato
  showSection('visualizacaoContrato');
}
function visualizarDocumento(element) {
  const conteudoContrato = document.getElementById('conteudo-detalhes');
  conteudoContrato.innerHTML = '';

  const titulo = element.getAttribute('data-titulo');
  const tipo = element.getAttribute('data-tipo');
  const dataEmissao = element.getAttribute('data-emissao');
  const dataExpiracao = element.getAttribute('data-expiracao');
  const descricao = element.getAttribute('data-descricao');
  const nome = element.getAttribute('data-nome');

  let html = `
    <div class="contrato-visual">
      <h2 style="text-align: center;">${titulo}</h2>
      <p><strong>Nome:</strong> ${nome}</p>
      <p><strong>Tipo:</strong> ${tipo}</p>
      <p><strong>Data de Criação:</strong> ${dataEmissao}</p>
      <p><strong>Data de Expiração:</strong> ${dataExpiracao}</p>
      <hr>
      <p style="margin-top: 20px;">${descricao}</p>
    </div>
  `;

  conteudoContrato.innerHTML = html;

  // Chamar sua função padrão pra exibir a section certa
  showSection('detalhes-documento');
}
async function handleAssinarContrato(button) {
  const confirmar = confirm("Você confirma que leu e concorda com os termos deste contrato?");
  if (!confirmar) {
    alert("Assinatura cancelada.");
    return; // Sai da função se a pessoa não confirmar
  }
  const assinatura_doc_id = button.getAttribute('data-id');
  const encarregado_id = button.getAttribute('data-id_encarregado');
  const estudante_id = button.getAttribute('data-id_estudante');
  try {
    const response = await fetch('/assinar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          assinatura_doc_id,
          encarregado_id,
          estudante_id
        })
    });

    if (!response.ok) {
      throw new Error('Falha na comunicação com o servidor.');
    }

    const data = await response.json();

    if (data.sucesso) {
        alert(data.motivo);
        location.reload();
    } else {
      alert("Erro: " + data.motivo);
    }
  } catch (err) {
    console.error('Erro ao assinar contrato:', err);
    alert("Erro ao assinar contrato.");
  }
}