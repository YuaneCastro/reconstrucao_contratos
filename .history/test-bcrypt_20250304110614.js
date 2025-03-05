const bcrypt = require('bcrypt');

const senhaDigitada = "123";  // Muda para a senha que você digitou no login
const hashSalvo = "HASH_AQUI";  // Pega do banco de dados

async function testarSenha() {
    const resultado = await bcrypt.compare(senhaDigitada, hashSalvo);
    console.log("A senha está correta?", resultado); // true ou false
}

testarSenha();
