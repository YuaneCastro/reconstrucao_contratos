require('dotenv').config();
const { Client } = require('pg');

// Utilizando DATABASE_URL, que é configurada automaticamente pelo Railway
const pool = new Pool({
  connectionString: 'postgresql://postgres:yGlhxZxXGrCQkDOclglmppNCNfSMklGx@postgres.railway.internal:5432/railway',
  ssl: { rejectUnauthorized: false }
});

client.connect()
  .then(() => console.log('Conexão bem-sucedida ao banco de dados!'))
  .catch(err => console.error('Erro de conexão: ', err.stack));

module.exports = client;