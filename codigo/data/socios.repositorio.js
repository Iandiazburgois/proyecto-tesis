// Tabla socio (y grupo_familia en el registro, dentro de una transacción).
const db = require('../config/db');

// Columnas que se pueden devolver de un socio. Se listan una por una
// para que password_hash nunca salga de acá, salvo en las dos funciones que lo necesitan.
const PUBLICAS = `id_socio, nombre, apellido, dni, email, telefono, fecha_nacimiento,
  categoria, estado, dni_frente_url, dni_dorso_url, fecha_alta, rol`;

// Filtros opcionales: estado y q (busca en nombre y apellido, DNI o email).
async function todos({ estado, q } = {}) {
  const condiciones = [];
  const valores = [];
  if (estado) {
    valores.push(estado);
    condiciones.push(`estado = $${valores.length}`);
  }
  if (q) {
    valores.push(`%${q}%`);
    const p = `$${valores.length}`;
    condiciones.push(`(unaccent(nombre || ' ' || apellido) ILIKE unaccent(${p}) OR dni ILIKE ${p} OR email ILIKE ${p})`);
  }
  const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';
  const resultado = await db.query(`SELECT ${PUBLICAS} FROM socio ${where} ORDER BY apellido, nombre`, valores);
  return resultado.rows;
}

async function porId(id) {
  const resultado = await db.query(`SELECT ${PUBLICAS} FROM socio WHERE id_socio = $1`, [id]);
  return resultado.rows[0] ?? null;
}

// Con el hash: solo para comparar la contraseña al cambiarla.
async function porIdConHash(id) {
  const resultado = await db.query('SELECT id_socio, password_hash FROM socio WHERE id_socio = $1', [id]);
  return resultado.rows[0] ?? null;
}

// Para el login: el usuario puede escribir su email o su DNI. Trae el hash para compararlo.
async function porEmailODni(usuario) {
  const resultado = await db.query(
    `SELECT ${PUBLICAS}, password_hash FROM socio WHERE email = LOWER($1) OR dni = $1`,
    [usuario]
  );
  return resultado.rows[0] ?? null;
}

// Un socio que ya use ese email o ese DNI, o null si no hay.
async function existeEmailODni(email, dni) {
  const resultado = await db.query(
    'SELECT id_socio, email, dni FROM socio WHERE email = LOWER($1) OR dni = $2 LIMIT 1',
    [email, dni]
  );
  return resultado.rows[0] ?? null;
}

async function emailUsadoPorOtro(email, id) {
  const resultado = await db.query('SELECT 1 FROM socio WHERE email = LOWER($1) AND id_socio <> $2', [email, id]);
  return resultado.rows.length > 0;
}

async function crearConFamiliares(socio, familiares) {
  const cliente = await db.pool.connect();
  try {
    await cliente.query('BEGIN');

    const resultado = await cliente.query(
      `INSERT INTO socio (nombre, apellido, dni, email, password_hash, telefono,
                          fecha_nacimiento, dni_frente_url, dni_dorso_url)
       VALUES ($1, $2, $3, LOWER($4), $5, $6, $7, $8, $9)
       RETURNING ${PUBLICAS}`,
      [socio.nombre, socio.apellido, socio.dni, socio.email, socio.password_hash,
       socio.telefono ?? null, socio.fecha_nacimiento, socio.dni_frente_url ?? null, socio.dni_dorso_url ?? null]
    );
    const creado = resultado.rows[0];

    const grupo = [];
    for (const f of familiares) {
      const r = await cliente.query(
        `INSERT INTO grupo_familia (id_socio_titular, nombre, apellido, dni, parentesco, dni_frente_url, dni_dorso_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [creado.id_socio, f.nombre, f.apellido, f.dni, f.parentesco, f.dni_frente_url ?? null, f.dni_dorso_url ?? null]
      );
      grupo.push(r.rows[0]);
    }

    await cliente.query('COMMIT');
    return { ...creado, grupo_familia: grupo };
  } catch (err) {
    await cliente.query('ROLLBACK');
    throw err;
  } finally {
    cliente.release(); // la conexión vuelve al pool, salga bien o mal
  }
}

// COALESCE: lo que no se manda (llega null) queda como estaba.
// Sirve para el socio (nombre, apellido, telefono, email) y para el admin (estado, categoria, rol).
async function actualizar(id, datos) {
  const resultado = await db.query(
    `UPDATE socio SET
       nombre = COALESCE($1, nombre),
       apellido = COALESCE($2, apellido),
       telefono = COALESCE($3, telefono),
       email = COALESCE(LOWER($4), email),
       estado = COALESCE($5, estado),
       categoria = COALESCE($6, categoria),
       rol = COALESCE($7, rol)
     WHERE id_socio = $8
     RETURNING ${PUBLICAS}`,
    [datos.nombre ?? null, datos.apellido ?? null, datos.telefono ?? null, datos.email ?? null,
     datos.estado ?? null, datos.categoria ?? null, datos.rol ?? null, id]
  );
  return resultado.rows[0] ?? null;
}

async function cambiarPassword(id, hash) {
  await db.query('UPDATE socio SET password_hash = $1 WHERE id_socio = $2', [hash, id]);
}

async function cambiarEstado(id, estado) {
  const resultado = await db.query(
    `UPDATE socio SET estado = $1 WHERE id_socio = $2 RETURNING ${PUBLICAS}`,
    [estado, id]
  );
  return resultado.rows[0] ?? null;
}

// Borra al socio. Por el ON DELETE CASCADE del esquema, se borran también sus cuotas y su grupo familiar.
async function borrar(id) {
  const resultado = await db.query('DELETE FROM socio WHERE id_socio = $1', [id]);
  return resultado.rowCount === 1;
}

async function familiaresDe(id) {
  const resultado = await db.query(
    'SELECT * FROM grupo_familia WHERE id_socio_titular = $1 ORDER BY id_grupo',
    [id]
  );
  return resultado.rows;
}

module.exports = {
  todos, porId, porIdConHash, porEmailODni, existeEmailODni, emailUsadoPorOtro,
  crearConFamiliares, actualizar, cambiarPassword, cambiarEstado, borrar, familiaresDe,
};
