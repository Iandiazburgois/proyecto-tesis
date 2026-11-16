const db = require('../config/db');

function aCuota(fila) {
  return { ...fila, monto: Number(fila.monto) };
}

const CON_SOCIO = `SELECT c.*, s.nombre, s.apellido, s.dni
                   FROM cuota c JOIN socio s ON s.id_socio = c.id_socio`;

async function deSocio(idSocio) {
  const resultado = await db.query(
    'SELECT * FROM cuota WHERE id_socio = $1 ORDER BY anio_periodo, mes_periodo',
    [idSocio]
  );
  return resultado.rows.map(aCuota);
}

async function porId(id) {
  const resultado = await db.query(`${CON_SOCIO} WHERE c.id_cuota = $1`, [id]);
  return resultado.rows[0] ? aCuota(resultado.rows[0]) : null;
}

// La cuota de ese socio en ese mes y año si existe.
async function porPeriodo(idSocio, mes, anio) {
  const resultado = await db.query(
    'SELECT id_cuota FROM cuota WHERE id_socio = $1 AND mes_periodo = $2 AND anio_periodo = $3',
    [idSocio, mes, anio]
  );
  return resultado.rows[0] ?? null;
}

const FILTROS = { id_socio: 'c.id_socio', estado: 'c.estado_pago', mes: 'c.mes_periodo', anio: 'c.anio_periodo' };

async function todas(filtros = {}) {
  const condiciones = [];
  const valores = [];
  for (const [clave, columna] of Object.entries(FILTROS)) {
    if (filtros[clave] !== undefined) {
      valores.push(filtros[clave]);
      condiciones.push(`${columna} = $${valores.length}`);
    }
  }
  const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';
  const resultado = await db.query(
    `${CON_SOCIO} ${where} ORDER BY c.anio_periodo DESC, c.mes_periodo DESC, s.apellido`,
    valores
  );
  return resultado.rows.map(aCuota);
}

async function crear(datos) {
  const resultado = await db.query(
    `INSERT INTO cuota (id_socio, mes_periodo, anio_periodo, monto, fecha_vencimiento)
     VALUES ($1, $2, $3, $4, $5) RETURNING id_cuota`,
    [datos.id_socio, datos.mes_periodo, datos.anio_periodo, datos.monto, datos.fecha_vencimiento]
  );
  return porId(resultado.rows[0].id_cuota);
}

// COALESCE: lo que no se manda queda como estaba.
// Si se marca como Pagado y no tenía fecha de pago (pagó en secretaría), se pone la de hoy.
async function actualizar(id, datos) {
  const resultado = await db.query(
    `UPDATE cuota SET
       estado_pago = COALESCE($1, estado_pago),
       monto = COALESCE($2, monto),
       fecha_vencimiento = COALESCE($3, fecha_vencimiento),
       fecha_pago = CASE WHEN $1 = 'Pagado' AND fecha_pago IS NULL THEN NOW() ELSE fecha_pago END
     WHERE id_cuota = $4`,
    [datos.estado_pago ?? null, datos.monto ?? null, datos.fecha_vencimiento ?? null, id]
  );
  return resultado.rowCount ? porId(id) : null;
}

// El socio informa un pago: queda "En revisión" hasta que el admin lo confirma.
async function registrarComprobante(id, comprobanteUrl, medioPago) {
  await db.query(
    `UPDATE cuota SET comprobante_url = $1, medio_pago = $2,
            estado_pago = 'En revisión', fecha_pago = NOW()
     WHERE id_cuota = $3`,
    [comprobanteUrl, medioPago, id]
  );
  return porId(id);
}

async function borrar(id) {
  const resultado = await db.query('DELETE FROM cuota WHERE id_cuota = $1', [id]);
  return resultado.rowCount === 1;
}

module.exports = { deSocio, porId, porPeriodo, todas, crear, actualizar, registrarComprobante, borrar };
