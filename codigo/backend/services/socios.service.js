const bcrypt = require('bcryptjs');
const repositorio = require('../data/socios.repositorio');
const cuotas = require('../data/cuotas.repositorio');
const { ErrorDeNegocio, ErrorDeDatos } = require('../utils/errores');

const BAJA = 'Baja solicitada';

// Mis datos y mi grupo familiar. null = no existe.
async function verMiPerfil(id) {
  const socio = await repositorio.porId(id);
  if (!socio) return null;
  return { ...socio, grupo_familia: await repositorio.familiaresDe(id) };
}

async function actualizarMiPerfil(id, datos) {
  if (datos.email && (await repositorio.emailUsadoPorOtro(datos.email, id))) {
    throw new ErrorDeNegocio('Ese email ya lo usa otro socio');
  }
  return repositorio.actualizar(id, datos);
}

// null = no existe; true = cambiada. Si la actual no coincide, ErrorDeDatos (400):
async function cambiarPassword(id, actual, nueva) {
  const socio = await repositorio.porIdConHash(id);
  if (!socio) return null;
  if (!(await bcrypt.compare(actual, socio.password_hash))) {
    throw new ErrorDeDatos('La contraseña actual no es correcta');
  }
  await repositorio.cambiarPassword(id, await bcrypt.hash(nueva, 10));
  return true;
}

async function solicitarBaja(id) {
  const socio = await repositorio.porId(id);
  if (!socio) return null;
  if (socio.estado === BAJA) throw new ErrorDeNegocio('Ya habías solicitado la baja');
  return repositorio.cambiarEstado(id, BAJA);
}

async function listar(filtros) {
  return repositorio.todos(filtros);
}

// La ficha que necesita el admin: el socio, su grupo familiar y sus cuotas.
async function obtener(id) {
  const socio = await repositorio.porId(id);
  if (!socio) return null;
  const [grupo, susCuotas] = await Promise.all([repositorio.familiaresDe(id), cuotas.deSocio(id)]);
  return { ...socio, grupo_familia: grupo, cuotas: susCuotas };
}

// El admin cambia estado, categoría o rol.
async function actualizar(id, datos) {
  return repositorio.actualizar(id, datos);
}

async function eliminar(id) {
  return repositorio.borrar(id);
}

module.exports = {
  verMiPerfil, actualizarMiPerfil, cambiarPassword, solicitarBaja,
  listar, obtener, actualizar, eliminar,
};
