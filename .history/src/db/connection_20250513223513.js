require('dotenv').config();
const { Pool } = require('pg');

// Utilizando DATABASE_URL, que é configurada automaticamente pelo Railway
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;