const { Client } = require('pg');

// Configurações da conexão
const client = new Client({
  user: 'seu_usuario',
  host: 'localhost',
  database: 'seu_banco_de_dados',
  password: 'sua_senha',
  port: 5432, // ou a porta do seu banco
});

// Conectar ao banco de dados
client.connect()
  .then(() => console.log('Conexão bem-sucedida ao banco de dados!'))
  .catch(err => console.error('Erro de conexão: ', err.stack));

module.exports = client;
