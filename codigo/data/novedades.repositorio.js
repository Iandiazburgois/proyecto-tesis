const db = require('../config/db');

// Todas las novedades, de la mas nueva a la más vieja
async function todas() {
  const resultado = await db.query(
    'SELECT * FROM novedad ORDER BY fecha_publicacion DESC'
  );
  return resultado.rows;
}

// Una novedad por su id, o da null si no existe
async function porId(id) {
  const resultado = await db.query(
    'SELECT * FROM novedad WHERE id_novedad = $1',
    [id]
  );
  return resultado.rows[0] ?? null;
}

// Crea una novedad y la devuelve completa con su id y su fecha.
async function crear(datos) {
  const resultado = await db.query(
    `INSERT INTO novedad (titulo, contenido, imagen_url, destacado, id_autor)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [datos.titulo, datos.contenido, datos.imagen_url ?? null, datos.destacado ?? false, datos.id_autor]
  );
  return resultado.rows[0];
}

// Modifica una novedad,lo que no se manda queda como estaba.
// Devuelve la novedad modificada, o da null si no existe.
async function actualizar(id, datos) {
  const resultado = await db.query(
    `UPDATE novedad SET
       titulo     = COALESCE($1, titulo),
       contenido  = COALESCE($2, contenido),
       imagen_url = COALESCE($3, imagen_url),
       destacado  = COALESCE($4, destacado)
     WHERE id_novedad = $5
     RETURNING *`,
    [datos.titulo ?? null, datos.contenido ?? null, datos.imagen_url ?? null, datos.destacado ?? null, id]
  );
  return resultado.rows[0] ?? null;
}

// Borra una novedad. Devuelve true si la borro, false si no existía.
async function borrar(id) {
  const resultado = await db.query(
    'DELETE FROM novedad WHERE id_novedad = $1',
    [id]
  );
  return resultado.rowCount === 1;
}

module.exports = { todas, porId, crear, actualizar, borrar };
