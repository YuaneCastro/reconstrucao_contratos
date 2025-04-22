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
async function assinarDocumento(id) {
  try {
    // Busca o conteúdo real do contrato via backend
    const response = await fetch(`/documentos/${id}`);
    const data = await response.json();

    // Verifica e exibe o conteúdo
    if (data && data.conteudo) {
      document.getElementById('conteudoContrato').innerHTML = data.conteudo;
      document.getElementById('contratos').style.display = 'none';
      document.getElementById('visualizacaoContrato').style.display = 'block';

      // Guarda o ID para o processo de assinatura
      window.contratoAtual = id;
    } else {
      alert('Erro ao carregar o contrato.');
    }
  } catch (error) {
    console.error('Erro ao buscar contrato:', error);
    alert('Erro ao buscar o contrato.');
  }
}