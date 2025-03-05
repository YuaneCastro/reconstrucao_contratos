function logout() {
    fetch('/logout', { method: 'GET' })
        .then(() => {
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            window.location.href = "/login"; 
        })
        .catch(error => console.error("Erro ao fazer logout:", error));
}
