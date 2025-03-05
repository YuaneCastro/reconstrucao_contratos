const bcrypt = require('bcrypt');

const senhaDigitada = "1";  
// Muda para a senha que você digitou no login
const hashSalvo ="$2b$10$LCl83el6uTHturJLoHdl6.yo6KtuZbnd1rbVlhsOB0NGZiSsXKplq";  // Pega do banco de dados

async function testarSenha() {
    const resultado = await bcrypt.compare(senhaDigitada, hashSalvo);
    console.log("A senha está correta?", resultado); // true ou false
}

testarSenha();
