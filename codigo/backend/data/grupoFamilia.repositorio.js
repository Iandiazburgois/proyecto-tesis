const db = require('../config/db');

// Las consultas filtran por id_socio_titular: un socio solo ve, cambia
// y borra a su propia familia. El familiar de otro socio "no existe" para el.

// Los familiares de un socio
async function deTitular(idTitular) {
  const resultado = await db.query(
    'SELECT * FROM grupo_familia WHERE id_socio_titular = $1 ORDER BY id_grupo',
    [idTitular]
  );
  return resultado.rows;
}

// Un familiar de ese socio, o null si no existe o es de otro socio
async function porId(id, idTitular) {
  const resultado = await db.query(
    'SELECT * FROM grupo_familia WHERE id_grupo = $1 AND id_socio_titular = $2',
    [id, idTitular]
  );
  return resultado.rows[0] ?? null;
}

// El familiar con ese DNI dentro del grupo de ese socio, o null
async function porDni(dni, idTitular) {
  const resultado = await db.query(
    'SELECT * FROM grupo_familia WHERE dni = $1 AND id_socio_titular = $2',
    [dni, idTitular]
  );
  return resultado.rows[0] ?? null;
}

// Agrega un familiar al grupo del socio
async function crear(datos, idTitular) {
  const resultado = await db.query(
    `INSERT INTO grupo_familia (id_socio_titular, nombre, apellido, dni, parentesco, dni_frente_url, dni_dorso_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [idTitular, datos.nombre, datos.apellido, datos.dni, datos.parentesco,
     datos.dni_frente_url ?? null, datos.dni_dorso_url ?? null]
  );
  return resultado.rows[0];
}

// Modifica un familiar del socio. Lo que no se envia queda como estaba.
async function actualizar(id, datos, idTitular) {
  const resultado = await db.query(
    `UPDATE grupo_familia SET
       nombre         = COALESCE($1, nombre),
       apellido       = COALESCE($2, apellido),
       dni            = COALESCE($3, dni),
       parentesco     = COALESCE($4, parentesco),
       dni_frente_url = COALESCE($5, dni_frente_url),
       dni_dorso_url  = COALESCE($6, dni_dorso_url)
     WHERE id_grupo = $7 AND id_socio_titular = $8
     RETURNING *`,
    [datos.nombre ?? null, datos.apellido ?? null, datos.dni ?? null, datos.parentesco ?? null,
     datos.dni_frente_url ?? null, datos.dni_dorso_url ?? null, id, idTitular]
  );
  return resultado.rows[0] ?? null;
}

// Borra un familiar del socio,devuelve true si lo borro o false si no existía o era de otro.
async function borrar(id, idTitular) {
  const resultado = await db.query(
    'DELETE FROM grupo_familia WHERE id_grupo = $1 AND id_socio_titular = $2',
    [id, idTitular]
  );
  return resultado.rowCount === 1;
}

module.exports = { deTitular, porId, porDni, crear, actualizar, borrar };