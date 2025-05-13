require('dotenv').config();
const { Pool } = require('pg');

// Utilizando DATABASE_URL, que é configurada automaticamente pelo Railway
const pool = new Pool({
  user: 'postgres' ,
  host: 'localhost',
  database: '',
  password: '',
  port: '',
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