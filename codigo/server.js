require('dotenv').config();

const app = require('./app');
const db = require('./config/db');

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  try {
    await db.query('SELECT NOW()');
    console.log('Conexión a PostgreSQL OK');
  } catch (err) {
    console.error('No se pudo conectar a la base:', err.code, err.message || err);
  }
});
