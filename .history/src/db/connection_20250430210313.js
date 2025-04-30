require('dotenv').config();
const { pool } = require('pg');

// Utilizando DATABASE_URL, que é configurada automaticamente pelo Railway
const pool = new Pool({
  connectionString: 'postgresql://postgres:yGlhxZxXGrCQkDOclglmppNCNfSMklGx@postgres.railway.internal:5432/railway',
  ssl: { rejectUnauthorized: false }
});

pool.connect()
  .then(client => {
    console.log('Conectado ao banco de dados!');
    client.release();
  })
  .catch(err => {
    console.error('Erro ao conectar ao banco de dados:', err);
  });

module.exports = client;