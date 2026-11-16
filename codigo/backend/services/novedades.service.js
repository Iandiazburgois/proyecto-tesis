// Las novedades no tienen reglas propias- el servicio pasa todo al repositorio.

const repositorio = require('../data/novedades.repositorio');

async function listar() {
  return repositorio.todas();
}

async function obtener(id) {
  return repositorio.porId(id);
}

// El autor es el admin que está logueado, llega aparte, no desde el cuerpo del pedido
async function crear(datos, idAutor) {
  return repositorio.crear({ ...datos, id_autor: idAutor });
}

async function actualizar(id, datos) {
  return repositorio.actualizar(id, datos);
}

async function eliminar(id) {
  return repositorio.borrar(id);
}

module.exports = { listar, obtener, crear, actualizar, eliminar };