const { Client } = require('pg');

// Configurações da conexão
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'contratos',
  password: '0202',
  port: 5432, // ou a porta do seu banco
});

// Conectar ao banco de dados
client.connect()
  .then(() => console.log('Conexão bem-sucedida ao banco de dados!'))
  .catch(err => console.error('Erro de conexão: ', err.stack));

module.exports = client;