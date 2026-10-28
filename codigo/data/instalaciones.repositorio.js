const db = require('../config/db');
const { patronLike } = require('./patron');

// Todas las instalaciones, ordenadas por nombre
async function todas() {
  const resultado = await db.query('SELECT * FROM instalacion ORDER BY nombre');
  return resultado.rows;
}

// Una instalación por su id, o aparece null si no existe
async function porId(id) {
  const resultado = await db.query(
    'SELECT * FROM instalacion WHERE id_instalacion = $1',
    [id]
  );
  return resultado.rows[0] ?? null;
}

// Crea una instalación y la devuelve con su id
async function crear(datos) {
  const resultado = await db.query(
    'INSERT INTO instalacion (nombre, descripcion, imagen_url) VALUES ($1, $2, $3) RETURNING *',
    [datos.nombre, datos.descripcion ?? null, datos.imagen_url ?? null]
  );
  return resultado.rows[0];
}

// Modifica una instalación,aquello que no se manda queda como estaba.
// Devuelve la instalación modificada, o null si no existe.
async function actualizar(id, datos) {
  const resultado = await db.query(
    `UPDATE instalacion SET
       nombre      = COALESCE($1, nombre),
       descripcion = COALESCE($2, descripcion),
       imagen_url  = COALESCE($3, imagen_url)
     WHERE id_instalacion = $4
     RETURNING *`,
    [datos.nombre ?? null, datos.descripcion ?? null, datos.imagen_url ?? null, id]
  );
  return resultado.rows[0] ?? null;
}

// Borra una instalación. Devuelve true si la borro y false si no existía.
async function borrar(id) {
  const resultado = await db.query(
    'DELETE FROM instalacion WHERE id_instalacion = $1',
    [id]
  );
  return resultado.rowCount === 1;
}
// Para el buscador: busca el texto en el nombre y en la descripción.
// No importan las mayúsculas (ILIKE) ni las tildes (unaccent).
async function buscarTexto(texto) {
  const resultado = await db.query(
    `SELECT * FROM instalacion
     WHERE unaccent(nombre) ILIKE unaccent($1) OR unaccent(descripcion) ILIKE unaccent($1)
     ORDER BY nombre`,
    [patronLike(texto)]
  );
  return resultado.rows;
}

module.exports = { todas, porId, crear, actualizar, borrar, buscarTexto };