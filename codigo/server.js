const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ mensaje: 'API REST Club Sportivo San Cayetano funcionando correctamente' });
});

app.listen(PORT, async () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  try {
    await db.query('SELECT NOW()');
    console.log('Conexión a PostgreSQL OK');
  } catch (err) {
    console.error('No se pudo conectar a la base:', err.code, err.message || err);
  }
});