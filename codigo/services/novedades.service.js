const repositorio = require('../data/novedades.repositorio');
const { ErrorDeNegocio } = require('../utils/errores');


async function listar() {
  return repositorio.todas();
}

// Funciones a escribir:
// obtener(id)
// crear(datos, idAutor)
// actualizar(id, datos)
// eliminar(id)

module.exports = { listar };
