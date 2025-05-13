require('dotenv').config();
const { Pool } = require('pg');

// Utilizando DATABASE_URL, que é configurada automaticamente pelo Railway
const pool = new Pool({
  connectionString: process,
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;