const { Client } = require('pg');

// Configurações da conexão
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'contratos',
  password: 's0202a',
  port: 5432, // ou a porta do seu banco
});

// Conectar ao banco de dados
client.connect()
  .then(() => console.log('Conexão bem-sucedida ao banco de dados!'))
  .catch(err => console.error('Erro de conexão: ', err.stack));

module.exports = client;

PORT=3000
DB_USER=
DB_HOST=localhost
DB_NAME=
DB_PASSWORD=
DB_PORT=5432