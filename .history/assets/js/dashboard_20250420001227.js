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
function assinarDocumento(id) {
  const contratosDiv = document.getElementById('contratos');
  const visualizacaoDiv = document.getElementById('visualizacaoContrato');
  const conteudoContrato = document.getElementById('conteudoContrato');

  // Exibe o conteúdo do contrato com base no ID
  if (contratos[id]) {
    conteudoContrato.innerHTML = `<p>${contratos[id]}</p>`;
  } else {
    conteudoContrato.innerHTML = `<p><em>Contrato não encontrado.</em></p>`;
  }

  // Alternar visibilidade
  contratosDiv.style.display = 'none';
  visualizacaoDiv.style.display = 'block';

  // Armazena o ID atual para uso posterior
  visualizacaoDiv.dataset.idAtual = id;
}

function assinarContrato() {
  const id = document.getElementById('visualizacaoContrato').dataset.idAtual;

  // Aqui você pode enviar para o backend via fetch/axios
  alert(`Contrato ${id} assinado com sucesso! 💼`);

  // Retorna à lista após "assinar"
  voltarLista();
}

function voltarLista() {
  document.getElementById('visualizacaoContrato').style.display = 'none';
  document.getElementById('contratos').style.display = 'block';
}