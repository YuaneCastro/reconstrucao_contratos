require('dotenv').config();
const { Pool } = require('pg');

// Utilizando DATABASE_URL, que é configurada automaticamente pelo Railway
const pool = new Pool({
  connectionString: 'postgresql://postgres:yGlhxZxXGrCQkDOclglmppNCNfSMklGx@postgres.railway.internal:5432/railway',
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;