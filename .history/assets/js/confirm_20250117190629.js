
        // Obtém o tempo restante inicial do servidor
        let timeRemaining = <%= remainingTime %>;

        // Elemento do timer
        const timerElement = document.getElementById('timer');

        // Atualiza a exibição do timer
        const updateTimerDisplay = () => {
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        };

        // Contagem regressiva
        const countdown = setInterval(() => {
            if (timeRemaining > 0) {
                timeRemaining--;
                updateTimerDisplay();
            } else {
                clearInterval(countdown);
                timerElement.textContent = 'Expirado!'; // Exibe mensagem de expiração
            }
        }, 1000);

        // Exibição inicial
        updateTimerDisplay();
    </script>