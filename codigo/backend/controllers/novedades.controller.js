const servicio = require('../services/novedades.service');
const { idValido, faltantes, tomar, demasiadoLargos, responderError } = require('./validar');

const CAMPOS = ['titulo', 'contenido', 'imagen_url', 'destacado'];
const OBLIGATORIOS = ['titulo', 'contenido'];
const LARGOS = { titulo: 150, imagen_url: 255 };

// Revisa el formato, destacado tiene que ser true o false, y los textos no pueden ser muy largos
function errorDeFormato(datos) {
  if (datos.destacado !== undefined && typeof datos.destacado !== 'boolean') {
    return 'destacado tiene que ser true o false';
  }
  const largos = demasiadoLargos(datos, LARGOS);
  if (largos.length) return `Estos campos son demasiado largos: ${largos.join(', ')}`;
  return null;
}

// GET /api/novedades da 200 con la lista, de la más nueva a la más vieja
async function listar(req, res) {
  const novedades = await servicio.listar();
  res.json(novedades);
}

// GET /api/novedades/:id da 200, 400 si el id no es válido, 404 si no existe
async function obtener(req, res) {
  const id = idValido(req.params.id);
  if (!id) return res.status(400).json({ error: 'El id debe ser un número' });

  const novedad = await servicio.obtener(id);
  if (!novedad) return res.status(404).json({ error: 'Novedad no encontrada' });

  res.json(novedad);
}

// POST /api/novedades  cuerpo: { titulo*, contenido*, imagen_url, destacado }
// El autor sale de la sesión (req.usuario.id), no del cuerpo.
//tira 201 con la creada, 400 si faltan datos o el formato está mal
async function crear(req, res) {
  const body = req.body || {};

  const falta = faltantes(body, OBLIGATORIOS);
  if (falta.length) return res.status(400).json({ error: 'Faltan campos obligatorios', campos: falta });

  const datos = tomar(body, CAMPOS);
  const error = errorDeFormato(datos);
  if (error) return res.status(400).json({ error });

  try {
    const creada = await servicio.crear(datos, req.usuario.id);
    res.status(201).json(creada);
  } catch (e) {
    responderError(e, res);
  }
}

// PUT /api/novedades/:id tira 200, 400, 404
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

  try {
    const novedad = await servicio.actualizar(id, datos);
    if (!novedad) return res.status(404).json({ error: 'Novedad no encontrada' });
    res.json(novedad);
  } catch (e) {
    responderError(e, res);
  }
}

// DELETE /api/novedades/:id da 204 sin cuerpo, 400, 404
async function eliminar(req, res) {
  const id = idValido(req.params.id);
  if (!id) return res.status(400).json({ error: 'El id debe ser un número' });

  const borrada = await servicio.eliminar(id);
  if (!borrada) return res.status(404).json({ error: 'Novedad no encontrada' });

  res.status(204).end();
}

module.exports = { listar, obtener, crear, actualizar, eliminar };