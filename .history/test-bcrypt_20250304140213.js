const bcrypt = require('bcrypt');

async function testarHash(senha) {
    const hash = await bcrypt.hash(senha, 10);
    console.log("Hash gerado:", hash);  // ✅ Verifica o hash criado

    const resultado = await bcrypt.compare(senha, hash);
    console.log("A senha corresponde ao hash?", resultado); // ✅ Deve ser true
}

testarHash("1
");  // Altere para testar com diferentes senhas
