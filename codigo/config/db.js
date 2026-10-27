const { Pool, types } = require('pg');
require('dotenv').config();

types.setTypeParser(1082, (valor) => valor); // DATE
types.setTypeParser(1114, (valor) => valor); // TIMESTAMP

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.on('connect', () => {
  console.log('Conectado exitosamente a PostgreSQL');
});

pool.on('error', (err) => {
  console.error('Error inesperado en la base de datos:', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};

//Archivo de conexion a la Base de Datos