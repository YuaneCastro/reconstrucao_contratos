const resendButton = document.getElementById('resend-button');
const timerElement = document.getElementById('timer');

let countdownTime = 60; // Tempo inicial em segundos
let timerInterval;

function startTimer() {
    countdownTime = 60;
    resendButton.disabled = true; // Desativa o botão de reenviar

    if (timerInterval) {
        clearInterval(timerInterval); // Limpa qualquer intervalo existente
      }

      timerInterval = setInterval(() => {
        countdownTime--;
  
        // Atualiza o timer na interface
        timerElement.textContent = countdownTime;
  
        if (countdownTime <= 0) {
          clearInterval(timerInterval); // Para o timer quando chegar a zero
          resendButton.disabled = false; // Reativa o botão
          timerElement.textContent = '0'; // Garante que o timer exiba 0
        }
      }, 1000); // Intervalo de 1 segundo
    }
  
    // Inicia o timer automaticamente ao carregar a página
    startTimer();