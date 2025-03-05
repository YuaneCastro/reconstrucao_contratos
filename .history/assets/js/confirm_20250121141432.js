let countdownTime = 40; // Tempo inicial em segundos (40 segundos)
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
    countdownTime = 40; // Reinicia o contador para 40 segundos
    resendButton.disabled = true; // Desativa o botão de reenviar

    if (timerInterval) {
      clearInterval(timerInterval); // Limpa qualquer intervalo existente
    }

    // Atualiza o timer inicial
    timerElement.textContent = formatTime(countdownTime);

    timerInterval = setInterval(() => {
      countdownTime--;

      // Atualiza o timer na interface a cada segundo
      timerElement.textContent = formatTime(countdownTime);

      if (countdownTime <= 0) {
        clearInterval(timerInterval); // Para o timer quando chegar a zero
        resendButton.disabled = false; // Reativa o botão de reenviar
        timerElement.textContent = '00:00'; // Garante que o timer mostre 00:00 quando expirar
      }
    }, 1000); // Atualiza a cada 1 segundo
  }

  startTimer();