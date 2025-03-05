let countdownTime = 60; // Tempo inicial em segundos
  const timerElement = document.getElementById('timer');
  const resendButton = document.getElementById('resend-button');

  let timerInterval; // Variável para o intervalo do timer

  // Função para formatar o tempo em MM:SS
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  }

  // Função para iniciar o timer
  function startTimer() {
    countdownTime = 60; // Reinicia o contador
    resendButton.disabled = true; // Desativa o botão

    if (timerInterval) {
      clearInterval(timerInterval); // Limpa qualquer intervalo existente
    }

    timerElement.textContent = formatTime(countdownTime); // Mostra o tempo inicial formatado

    timerInterval = setInterval(() => {
      countdownTime--;

      // Atualiza o timer na interface
      timerElement.textContent = formatTime(countdownTime);

      if (countdownTime <= 0) {
        clearInterval(timerInterval); // Para o timer quando chegar a zero
        resendButton.disabled = false; // Reativa o botão
        timerElement.textContent = '00:00'; // Garante que o timer exiba 00:00
      }
    }, 1000); // Intervalo de 1 segundo
  }

  // Inicia o timer automaticamente ao carregar a página
  startTimer();