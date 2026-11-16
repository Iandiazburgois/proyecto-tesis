const servicio = require('../services/cuotas.service');
const { idValido, faltantes, tomar, demasiadoLargos, esFecha, responderError } = require('./validar');

const ESTADOS = ['Pendiente', 'En revisión', 'Pagado'];

// medio_pago VARCHAR(50) y comprobante_url VARCHAR(255).
const MONTO_MAXIMO = 99999999.99;
const ANIO_MAXIMO = 2100;
const LARGOS_COMPROBANTE = { comprobante_url: 255, medio_pago: 50 };

// true si el monto es un número mayor a 0 y entra en la columna.
function montoValido(monto) {
  return monto > 0 && monto <= MONTO_MAXIMO;
}

// GET /api/cuotas/mias → 200
async function misCuotas(req, res) {
  res.json(await servicio.misCuotas(req.usuario.id));
}

// PUT /api/cuotas/:id/comprobante 
// → 200, 400, 404 (no existe o es de otro socio), 409 si ya está 'Pagado'
async function enviarComprobante(req, res) {
  const id = idValido(req.params.id);
  if (!id) return res.status(400).json({ error: 'El id debe ser un número' });
  const b = req.body || {};
  const falta = faltantes(b, ['comprobante_url', 'medio_pago']);
  if (falta.length) return res.status(400).json({ error: 'Faltan campos obligatorios', campos: falta });
  const largos = demasiadoLargos(b, LARGOS_COMPROBANTE);
  if (largos.length) return res.status(400).json({ error: 'Hay campos demasiado largos', campos: largos });
  try {
    const cuota = await servicio.enviarComprobante(id, req.usuario.id, b.comprobante_url, b.medio_pago);
    // 404 también si es de otro socio, un 403 confirmaría que la cuota existe.
    if (!cuota) return res.status(404).json({ error: 'Cuota no encontrada' });
    res.json(cuota);
  } catch (e) {
    responderError(e, res);
  }
}

// GET /api/cuotas (admin) → 200
async function listar(req, res) {
  const { id_socio, estado, mes, anio } = req.query;
  for (const [nombre, valor] of Object.entries({ id_socio, mes, anio })) {
    if (valor !== undefined && !idValido(valor)) return res.status(400).json({ error: `${nombre} debe ser un número` });
  }
  res.json(await servicio.listar({ id_socio, estado, mes, anio }));
}

// GET /api/cuotas/:id (admin) → 200, 400, 404
async function obtener(req, res) {
  const id = idValido(req.params.id);
  if (!id) return res.status(400).json({ error: 'El id debe ser un número' });
  const cuota = await servicio.obtener(id);
  if (!cuota) return res.status(404).json({ error: 'Cuota no encontrada' });
  res.json(cuota);
}

// POST /api/cuotas (admin)
// → 201, 400, 409 si ese socio ya tiene cuota de ese mes
async function crear(req, res) {
  const b = req.body || {};
  const falta = faltantes(b, ['id_socio', 'mes_periodo', 'anio_periodo', 'monto', 'fecha_vencimiento']);
  if (falta.length) return res.status(400).json({ error: 'Faltan campos obligatorios', campos: falta });
  const mes = Number(b.mes_periodo), anio = Number(b.anio_periodo), monto = Number(b.monto);
  if (!idValido(b.id_socio)) return res.status(400).json({ error: 'id_socio debe ser un número' });
  if (!Number.isInteger(mes) || mes < 1 || mes > 12) return res.status(400).json({ error: 'mes_periodo debe ser de 1 a 12' });
  if (!Number.isInteger(anio) || anio < 2026 || anio > ANIO_MAXIMO) {
    return res.status(400).json({ error: `anio_periodo debe estar entre 2026 y ${ANIO_MAXIMO}` });
  }
  if (!montoValido(monto)) {
    return res.status(400).json({ error: `monto debe ser mayor a 0 y hasta ${MONTO_MAXIMO}` });
  }
  if (!esFecha(b.fecha_vencimiento)) return res.status(400).json({ error: 'fecha_vencimiento tiene que ser AAAA-MM-DD' });

  try {
    const cuota = await servicio.crear({
      id_socio: Number(b.id_socio), mes_periodo: mes, anio_periodo: anio, monto, fecha_vencimiento: b.fecha_vencimiento,
    });
    res.status(201).json(cuota);
  } catch (e) {
    responderError(e, res);
  }
}

// PUT /api/cuotas/:id (admin)
async function actualizar(req, res) {
  const id = idValido(req.params.id);
  if (!id) return res.status(400).json({ error: 'El id debe ser un número' });
  const datos = tomar(req.body || {}, ['estado_pago', 'monto', 'fecha_vencimiento']);
  if (!Object.keys(datos).length) return res.status(400).json({ error: 'No se envió ningún dato para modificar' });
  if (datos.estado_pago !== undefined && !ESTADOS.includes(datos.estado_pago)) {
    return res.status(400).json({ error: `estado_pago debe ser uno de: ${ESTADOS.join(', ')}` });
  }
  if (datos.monto !== undefined) {
    datos.monto = Number(datos.monto);
    if (!montoValido(datos.monto)) {
      return res.status(400).json({ error: `monto debe ser mayor a 0 y hasta ${MONTO_MAXIMO}` });
    }
  }
  if (datos.fecha_vencimiento !== undefined && !esFecha(datos.fecha_vencimiento)) {
    return res.status(400).json({ error: 'fecha_vencimiento tiene que ser AAAA-MM-DD' });
  }
  const cuota = await servicio.actualizar(id, datos);
  if (!cuota) return res.status(404).json({ error: 'Cuota no encontrada' });
  res.json(cuota);
}

// DELETE /api/cuotas/:id (admin) → 204, 400, 404
async function eliminar(req, res) {
  const id = idValido(req.params.id);
  if (!id) return res.status(400).json({ error: 'El id debe ser un número' });
  if (!(await servicio.eliminar(id))) return res.status(404).json({ error: 'Cuota no encontrada' });
  res.status(204).end();
}

module.exports = { misCuotas, enviarComprobante, listar, obtener, crear, actualizar, eliminar };