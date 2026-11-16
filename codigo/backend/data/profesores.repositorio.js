const db = require('../config/db');

// Todos los profesores, ordenados por apellido
async function todas() {
  const resultado = await db.query('SELECT * FROM profesor ORDER BY apellido, nombre');
  return resultado.rows;
}

// Un profesor por su id, o null si no existe
async function porId(id) {
  const resultado = await db.query(
    'SELECT * FROM profesor WHERE id_profesor = $1',
    [id]
  );
  return resultado.rows[0] ?? null;
}

// Crea un profesor y lo devuelve con su id
async function crear(datos) {
  const resultado = await db.query(
    'INSERT INTO profesor (nombre, apellido) VALUES ($1, $2) RETURNING *',
    [datos.nombre, datos.apellido]
  );
  return resultado.rows[0];
}

// Modifica un profesor,lo que no se manda queda como estaba.
// Devuelve el profesor modificado, o null si no existe.
async function actualizar(id, datos) {
  const resultado = await db.query(
    `UPDATE profesor SET
       nombre   = COALESCE($1, nombre),
       apellido = COALESCE($2, apellido)
     WHERE id_profesor = $3
     RETURNING *`,
    [datos.nombre ?? null, datos.apellido ?? null, id]
  );
  return resultado.rows[0] ?? null;
}

// Borra un profesor. Devuelve true si lo borró, false si no existía.
// Sus actividades no se borran: quedan sin profesor.
async function borrar(id) {
  const resultado = await db.query(
    'DELETE FROM profesor WHERE id_profesor = $1',
    [id]
  );
  return resultado.rowCount === 1;
}

module.exports = { todas, porId, crear, actualizar, borrar };