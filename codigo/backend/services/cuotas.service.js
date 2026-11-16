const repositorio = require('../data/cuotas.repositorio');
const socios = require('../data/socios.repositorio');
const { ErrorDeNegocio, ErrorDeDatos } = require('../utils/errores');

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

module.exports = { misCuotas, enviarComprobante, listar, obtener, crear, actualizar, eliminar };
