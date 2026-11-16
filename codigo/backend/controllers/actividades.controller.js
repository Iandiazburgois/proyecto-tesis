const servicio = require('../services/actividades.service');
const { idValido, faltantes, tomar, demasiadoLargos, esHora, responderError } = require('./validar');

const CAMPOS = ['nombre', 'descripcion', 'dias', 'hora_inicio', 'hora_fin', 'id_profesor'];
const OBLIGATORIOS = ['nombre'];
const LARGOS = { nombre: 100, dias: 100 };

// Revisa el formato: horas "HH:MM" e id_profesor numérico.
// Que el profesor exista lo revisa el servicio.
function errorDeFormato(datos) {
  for (const campo of ['hora_inicio', 'hora_fin']) {
    if (datos[campo] !== undefined && !esHora(datos[campo])) {
      return `${campo} tiene que tener el formato HH:MM`;
    }
  }
  if (datos.id_profesor !== undefined && !idValido(datos.id_profesor)) {
    return 'id_profesor tiene que ser un número';
  }
  const largos = demasiadoLargos(datos, LARGOS);
  if (largos.length) return `Estos campos son demasiado largos: ${largos.join(', ')}`;
  return null;
}

// GET /api/actividades da 200 con la lista (cada una con su profesor)
async function listar(req, res) {
  const actividades = await servicio.listar();
  res.json(actividades);
}

// GET /api/actividades/:id da 200, 400 si el id no es válido, 404 si no existe
async function obtener(req, res) {
  const id = idValido(req.params.id);
  if (!id) return res.status(400).json({ error: 'El id debe ser un número' });

  const actividad = await servicio.obtener(id);
  if (!actividad) return res.status(404).json({ error: 'Actividad no encontrada' });

  res.json(actividad);
}

// POST /api/actividades  cuerpo: { nombre*, descripcion, dias, hora_inicio, hora_fin, id_profesor }
// da 201 con la creada, 400 si faltan datos, el formato está mal o el profesor no existe
async function crear(req, res) {
  const body = req.body || {};

  const falta = faltantes(body, OBLIGATORIOS);
  if (falta.length) return res.status(400).json({ error: 'Faltan campos obligatorios', campos: falta });

  const datos = tomar(body, CAMPOS);
  const error = errorDeFormato(datos);
  if (error) return res.status(400).json({ error });
  if (datos.id_profesor !== undefined) datos.id_profesor = Number(datos.id_profesor);

  try {
    const creada = await servicio.crear(datos);
    res.status(201).json(creada);
  } catch (e) {
    responderError(e, res);
  }
}

// PUT /api/actividades/:id da 200, 400, 404
async function actualizar(req, res) {
  const id = idValido(req.params.id);
  if (!id) return res.status(400).json({ error: 'El id debe ser un número' });

  const datos = tomar(req.body || {}, CAMPOS);
  if (!Object.keys(datos).length) {
    return res.status(400).json({ error: 'No se envió ningún dato para modificar' });
  }

  const vacios = faltantes(datos, OBLIGATORIOS.filter((c) => c in datos));
  if (vacios.length) return res.status(400).json({ error: 'Estos campos no pueden quedar vacíos', campos: vacios });

  const error = errorDeFormato(datos);
  if (error) return res.status(400).json({ error });
  if (datos.id_profesor !== undefined) datos.id_profesor = Number(datos.id_profesor);

  try {
    const actividad = await servicio.actualizar(id, datos);
    if (!actividad) return res.status(404).json({ error: 'Actividad no encontrada' });
    res.json(actividad);
  } catch (e) {
    responderError(e, res);
  }
}

// DELETE /api/actividades/:id da 204 sin cuerpo, 400, 404
async function eliminar(req, res) {
  const id = idValido(req.params.id);
  if (!id) return res.status(400).json({ error: 'El id debe ser un número' });

  const borrada = await servicio.eliminar(id);
  if (!borrada) return res.status(404).json({ error: 'Actividad no encontrada' });

  res.status(204).end();
}

module.exports = { listar, obtener, crear, actualizar, eliminar };