require('dotenv').config();

const { Client } = require('pg');

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function buscarDados() {
  await client.connect();
  const res = await client.query('SELECT id, nome, to_char(criado_em, \'YYYY-MM-DD HH24:MI:SS\') as criado_em FROM usuarios;');
  console.log(res.rows);
  await client.end();
}

buscarDados();

client.connect()
  .then(() => console.log('Conexão bem-sucedida ao banco de dados!'))
  .catch(err => console.error('Erro de conexão: ', err.stack));

module.exports = client;