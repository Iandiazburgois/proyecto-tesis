const db = require('../config/db');

// Cada actividad se devuelve con el nombre y apellido de su profesor.
//  usamos LEFT JOIN para que también aparezcan las actividades sin profesor.
const CON_PROFESOR = `
  SELECT a.*, p.nombre AS profesor_nombre, p.apellido AS profesor_apellido
  FROM actividad a
  LEFT JOIN profesor p ON p.id_profesor = a.id_profesor`;

// Todas las actividades, ordenadas por nombre
async function todas() {
  const resultado = await db.query(`${CON_PROFESOR} ORDER BY a.nombre`);
  return resultado.rows;
}

// Una actividad por su id, o aparece null si no existe
async function porId(id) {
  const resultado = await db.query(`${CON_PROFESOR} WHERE a.id_actividad = $1`, [id]);
  return resultado.rows[0] ?? null;
}

// Crea una actividad y la devuelve con su profesor
async function crear(datos) {
  const resultado = await db.query(
    `INSERT INTO actividad (nombre, descripcion, dias, hora_inicio, hora_fin, id_profesor)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id_actividad`,
    [datos.nombre, datos.descripcion ?? null, datos.dias ?? null,
     datos.hora_inicio ?? null, datos.hora_fin ?? null, datos.id_profesor ?? null]
  );
  
  return porId(resultado.rows[0].id_actividad);
}

// Modifica una actividad, lo que no se manda queda como estaba.
// Devuelve la actividad modificada, o null si no existe.
async function actualizar(id, datos) {
  const resultado = await db.query(
    `UPDATE actividad SET
       nombre      = COALESCE($1, nombre),
       descripcion = COALESCE($2, descripcion),
       dias        = COALESCE($3, dias),
       hora_inicio = COALESCE($4, hora_inicio),
       hora_fin    = COALESCE($5, hora_fin),
       id_profesor = COALESCE($6, id_profesor)
     WHERE id_actividad = $7`,
    [datos.nombre ?? null, datos.descripcion ?? null, datos.dias ?? null,
     datos.hora_inicio ?? null, datos.hora_fin ?? null, datos.id_profesor ?? null, id]
  );
  return resultado.rowCount === 1 ? porId(id) : null;
}

// Borra una actividad,devuelve true si la borro, false si no existía.
async function borrar(id) {
  const resultado = await db.query(
    'DELETE FROM actividad WHERE id_actividad = $1',
    [id]
  );
  return resultado.rowCount === 1;
}

module.exports = { todas, porId, crear, actualizar, borrar };