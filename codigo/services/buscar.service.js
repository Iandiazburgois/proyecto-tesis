// El buscador no tiene repositorio propio: usa buscarTexto() de los otros tres.
const novedades = require('../data/novedades.repositorio');
const actividades = require('../data/actividades.repositorio');
const instalaciones = require('../data/instalaciones.repositorio');

// Busca el texto en novedades, actividades e instalaciones.
// Las tres busquedas no dependen una de otra: se hacen al mismo tiempo con Promise.all.
async function buscar(texto) {
  const [n, a, i] = await Promise.all([
    novedades.buscarTexto(texto),
    actividades.buscarTexto(texto),
    instalaciones.buscarTexto(texto),
  ]);
  return { novedades: n, actividades: a, instalaciones: i };
}

module.exports = { buscar };