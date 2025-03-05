const bcrypt = require('bcrypt');

const senhaDigitada = "1";  // Muda para a senha que você digitou no login
const hashSalvo ="$2b$10$7zfgu097w4JQhnQc5A4XkuVsjatdDxzzhxSbt9EPXSc/MxqYTxRmu";  // Pega do banco de dados

async function testarSenha() {
    const resultado = await bcrypt.compare(senhaDigitada, hashSalvo);
    console.log("A senha está correta?", resultado); // true ou false
}

testarSenha();
