require("dotenv").config();
const { Pool } = require("pg");

// Pool gerencia múltiplas conexões com o banco de forma eficiente,
// reaproveitando conexões em vez de abrir uma nova a cada consulta
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // necessário para conectar no Neon
});

module.exports = pool;
