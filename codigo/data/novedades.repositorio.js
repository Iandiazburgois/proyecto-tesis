const db = require('../config/db');

async function todas() {
  const resultado = await db.query(
    'SELECT * FROM novedad ORDER BY fecha_publicacion DESC'
  );
  return resultado.rows;
}

// Funciones a escribir:
// porId(id)
// crear(datos)
// actualizar(id, datos)
// borrar(id)
// buscarTexto(texto)

module.exports = { todas };
