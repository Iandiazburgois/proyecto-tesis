const db = require('../config/db');

// Todos los sponsors ordenados por nombre
async function todas() {
  const resultado = await db.query('SELECT * FROM sponsor ORDER BY nombre');
  return resultado.rows;
}

// Un sponsor por su id, o null si no existe
async function porId(id) {
  const resultado = await db.query(
    'SELECT * FROM sponsor WHERE id_sponsor = $1',
    [id]
  );
  return resultado.rows[0] ?? null;
}

// Crea un sponsor y lo devuelve con su id
async function crear(datos) {
  const resultado = await db.query(
    'INSERT INTO sponsor (nombre, logo_url) VALUES ($1, $2) RETURNING *',
    [datos.nombre, datos.logo_url ?? null]
  );
  return resultado.rows[0];
}

// Modifica un sponsor. Lo que no se manda queda como estaba.
// Devuelve el sponsor modificado, o null si no existe.
async function actualizar(id, datos) {
  const resultado = await db.query(
    `UPDATE sponsor SET
       nombre   = COALESCE($1, nombre),
       logo_url = COALESCE($2, logo_url)
     WHERE id_sponsor = $3
     RETURNING *`,
    [datos.nombre ?? null, datos.logo_url ?? null, id]
  );
  return resultado.rows[0] ?? null;
}

// Borra un sponsor. Devuelve true si lo borro, false si no existia.
async function borrar(id) {
  const resultado = await db.query(
    'DELETE FROM sponsor WHERE id_sponsor = $1',
    [id]
  );
  return resultado.rowCount === 1;
}

module.exports = { todas, porId, crear, actualizar, borrar };