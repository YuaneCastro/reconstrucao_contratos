const bcrypt = require('bcrypt');

async function testarHash(senha) {
    const hash = '$2b$10$95yO.kiccuUrFETMDhEpPem/4VwuvNugHHLIs/Ympx1U8l2e42iZi' // ✅ Verifica o hash criado

    const resultado = await bcrypt.compare(senha, hash);
    console.log("A senha corresponde ao hash?", resultado); // ✅ Deve ser true
}

testarHash("1");  // Altere para testar com diferentes senhas
