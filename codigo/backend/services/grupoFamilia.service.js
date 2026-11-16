const repositorio = require('../data/grupoFamilia.repositorio');
const { ErrorDeNegocio } = require('../utils/errores');

// Regla: dentro del grupo de un socio no se puede repetir el DNI.
// Al modificar, el familiar puede quedarse con su propio DNI (por eso idPropio).
async function controlarDni(dni, idTitular, idPropio) {
  const otro = await repositorio.porDni(dni, idTitular);
  if (otro && otro.id_grupo !== idPropio) {
    throw new ErrorDeNegocio(`Ya hay un familiar con el DNI ${dni} en tu grupo`);
  }
}

async function listar(idTitular) {
  return repositorio.deTitular(idTitular);
}

async function obtener(id, idTitular) {
  return repositorio.porId(id, idTitular);
}

async function crear(datos, idTitular) {
  await controlarDni(datos.dni, idTitular);
  return repositorio.crear(datos, idTitular);
}

async function actualizar(id, datos, idTitular) {
  const actual = await repositorio.porId(id, idTitular);
  if (!actual) return null;

  if (datos.dni !== undefined) await controlarDni(datos.dni, idTitular, id);
  return repositorio.actualizar(id, datos, idTitular);
}

async function eliminar(id, idTitular) {
  return repositorio.borrar(id, idTitular);
}

module.exports = { listar, obtener, crear, actualizar, eliminar };