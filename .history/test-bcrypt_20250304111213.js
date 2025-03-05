const bcrypt = require('bcrypt');

async function gerarHash() {
    const senha = "1"; 
    const hash = await bcrypt.hash(senha, 10);
    console.log("Novo hash gerado:", hash);
}

gerarHash();
