const bcrypt = require('bcrypt');

const senhaDigitada = "1"; // Substitui pela senha que o usuário deveria digitar
const hashSalvo = "$2b$10$uDLatB5rOPBTahb7r.y0U.kp6wJqXcrZNkI5fK9l6VcEY2pv2aCNK"; // Hash armazenado no banco
const senha = "1"; 



async function testarSenha() {
    const resultado = await bcrypt.compare(senhaDigitada, hashSalvo);
    console.log("A senha está correta?", resultado);
    const hash = await bcrypt.hash(senha, 10);
    console.log("Novo hash gerado:", hash);
}

testarSenha();
