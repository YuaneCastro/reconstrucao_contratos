require('dotenv').config();
const { Pool } = require('pg');

// Utilizando DATABASE_URL, que é configurada automaticamente pelo Railway
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
PORT=3000
DB_USER=
DB_HOST=localhost 
DB_NAME=contratos
DB_PASSWORD=0202 
DB_PORT=5432 
pool.connect()
  .then(client => {
    console.log('Conectado ao banco de dados!');
    client.release();
  })
  .catch(err => {
    console.error('Erro ao conectar ao banco de dados:', err);
  });

module.exports = pool;