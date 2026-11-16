// Las instalaciones no tienen reglas propias,el servicio le pasa todo al repositorio.

const repositorio = require('../data/instalaciones.repositorio');

async function listar() {
  return repositorio.todas();
}

async function obtener(id) {
  return repositorio.porId(id);
}

async function crear(datos) {
  return repositorio.crear(datos);
}

async function actualizar(id, datos) {
  return repositorio.actualizar(id, datos);
}

async function eliminar(id) {
  return repositorio.borrar(id);
}

module.exports = { listar, obtener, crear, actualizar, eliminar };