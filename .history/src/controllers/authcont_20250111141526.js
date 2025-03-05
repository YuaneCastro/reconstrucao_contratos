function generateConfirmationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Gera código de 6 dígitos
}

module.exports = { generateConfirmationCode };
