const repositorio = require('../data/actividades.repositorio');
const profesores = require('../data/profesores.repositorio');
const { ErrorDeDatos } = require('../utils/errores');

// Como regla: si se indica un profesor, tiene que existir.
async function controlarProfesor(idProfesor) {
  if (idProfesor === undefined) return;
  const profesor = await profesores.porId(idProfesor);
  if (!profesor) throw new ErrorDeDatos('El profesor indicado no existe');
}

// Como regla: la actividad no puede terminar antes de empezar.
// Al modificar, se compara con los horarios que ya tenía guardados.
function controlarHorario(inicio, fin) {
  if (inicio && fin && fin.slice(0, 5) <= inicio.slice(0, 5)) {
    throw new ErrorDeDatos('La hora de fin tiene que ser posterior a la de inicio');
  }
}

async function listar() {
  return repositorio.todas();
}

async function obtener(id) {
  return repositorio.porId(id);
}

async function crear(datos) {
  await controlarProfesor(datos.id_profesor);
  controlarHorario(datos.hora_inicio, datos.hora_fin);
  return repositorio.crear(datos);
}

async function actualizar(id, datos) {
  const actual = await repositorio.porId(id);
  if (!actual) return null;

  await controlarProfesor(datos.id_profesor);
  controlarHorario(datos.hora_inicio ?? actual.hora_inicio, datos.hora_fin ?? actual.hora_fin);
  return repositorio.actualizar(id, datos);
}

async function eliminar(id) {
  return repositorio.borrar(id);
}

module.exports = { listar, obtener, crear, actualizar, eliminar };