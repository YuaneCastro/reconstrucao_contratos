const startTimer = (timeRemaining) => {
    const timerElement = document.getElementById('timer');

    const updateTimerDisplay = () => {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const countdown = setInterval(() => {
        if (timeRemaining > 0) {
            timeRemaining--;
            updateTimerDisplay();
        } else {
            clearInterval(countdown);
            timerElement.textContent = 'Expirado!';
        }
    }, 1000);

    // Exibição inicial
    updateTimerDisplay();
};
