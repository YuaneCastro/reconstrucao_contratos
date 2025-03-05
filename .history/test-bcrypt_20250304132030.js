const bcrypt = require('bcrypt');

const senhaDigitada = "1"; // Substitui pela senha que o usuário deveria digitar
const hashSalvo = "$2b$10$4vPtGtaz81mcVNPZnVqXXehEIm6rleRN9dZUnTQreoqwjuA8KIG66"; // Hash armazenado no banco
const senha = "1"; 
const hash = await bcrypt.hash(senha, 10);


async function testarSenha() {
    const resultado = await bcrypt.compare(senhaDigitada, hashSalvo);
    console.log("A senha está correta?", resultado);
    console.log("Novo hash gerado:", hash);
}

testarSenha();
