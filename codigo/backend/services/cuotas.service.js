const repositorio = require('../data/cuotas.repositorio');
const socios = require('../data/socios.repositorio');
const { ErrorDeNegocio, ErrorDeDatos } = require('../utils/errores');

// Cuota social: $3.000 por persona (titular + familiares)
const CUOTA_POR_PERSONA = 3000;
const DIA_VENCIMIENTO = 10;

// Valores de estado_pago: 'Pendiente', 'En revisión', 'Pagado'
async function misCuotas(idSocio) {
  const cuotas = await repositorio.deSocio(idSocio);
  // "En revisión" sigue siendo deuda: el club todavía no confirmó el comprobante.
  const impagas = cuotas.filter((c) => c.estado_pago !== 'Pagado');
  return {
    cuotas,
    cuotas_impagas: impagas.length,
    total_a_pagar: impagas.reduce((suma, c) => suma + c.monto, 0),
  };
}

async function enviarComprobante(idCuota, idSocio, comprobanteUrl, medioPago) {
  const cuota = await repositorio.porId(idCuota);
  if (!cuota || cuota.id_socio !== idSocio) return null;
  if (cuota.estado_pago === 'Pagado') throw new ErrorDeNegocio('Esa cuota ya figura como pagada');
  // Queda "En revisión", no "Pagado": el socio no se puede marcar la cuota como pagada solo.
  return repositorio.registrarComprobante(idCuota, comprobanteUrl, medioPago);
}

async function listar(filtros) {
  return repositorio.todas(filtros);
}

async function obtener(id) {
  return repositorio.porId(id);
}

async function crear(datos) {
  if (!(await socios.porId(datos.id_socio))) throw new ErrorDeDatos('El socio indicado no existe');
  if (await repositorio.porPeriodo(datos.id_socio, datos.mes_periodo, datos.anio_periodo)) {
    throw new ErrorDeNegocio('Ese socio ya tiene una cuota para ese mes y año');
  }
  return repositorio.crear(datos);
}

async function actualizar(id, datos) {
  return repositorio.actualizar(id, datos);
}

async function eliminar(id) {
  return repositorio.borrar(id);
}

// Crea la cuota del mes para cada socio activo. Si ya la tenía, lo saltea.
async function emitir(mes, anio) {
  const activos = (await socios.todos({ estado: 'Activo' })).filter((s) => s.rol === 'socio');
  // El vencimiento queda como "AAAA-MM-10"
  const vencimiento = `${anio}-${String(mes).padStart(2, '0')}-${DIA_VENCIMIENTO}`;
  let emitidas = 0;

  for (const socio of activos) {
    if (await repositorio.porPeriodo(socio.id_socio, mes, anio)) continue;
    const familiares = await socios.familiaresDe(socio.id_socio);
    await repositorio.crear({
      id_socio: socio.id_socio,
      mes_periodo: mes,
      anio_periodo: anio,
      monto: CUOTA_POR_PERSONA * (1 + familiares.length),
      fecha_vencimiento: vencimiento,
    });
    emitidas++;
  }

  return { emitidas, ya_tenian: activos.length - emitidas };
}
module.exports = { misCuotas, enviarComprobante, listar, obtener, crear, actualizar, eliminar, emitir };
