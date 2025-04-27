require('dotenv').config();
const { Client } = require('pg');

// Utilizando DATABASE_URL, que é configurada automaticamente pelo Railway
const client = new Client({
  connectionString: process.env.DATABASE_URL, // A URL completa gerada pelo Railway
  ssl: {
      rejectUnauthorized: false, // Configuração necessária para o PostgreSQL no Railway
  }
});



client.connect()
  .then(() => console.log('Conexão bem-sucedida ao banco de dados!'))
  .catch(err => console.error('Erro de conexão: ', err.stack));

module.exports = client;