const bcrypt = require('bcrypt');

const senhaDigitada = "1"; // Substitui pela senha que o usuário deveria digitar
const hashSalvo = "$2b$10$4vPtGtaz81mcVNPZnVqXXehEIm6rleRN9dZUnTQreoqwjuA8KIG66"; // Hash armazenado no banco

async function testarSenha() {
    const resultado = await bcrypt.compare(senhaDigitada, hashSalvo);
    console.log("A senha está correta?", resultado);
}

testarSenha();
