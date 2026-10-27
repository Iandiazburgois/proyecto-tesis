const servicio = require('../services/instalaciones.service');
const { idValido, faltantes, tomar, demasiadoLargos, responderError } = require('./validar');

const CAMPOS = ['nombre', 'descripcion', 'imagen_url'];
const OBLIGATORIOS = ['nombre'];
const LARGOS = { nombre: 100, imagen_url: 255 };

// GET /api/instalaciones  da 200 con la lista
async function listar(req, res) {
  const lista = await servicio.listar();
  res.json(lista);
}

// GET /api/instalaciones/:id tira 200, 400 si el id no es válido, 404 si no existe
async function obtener(req, res) {
  const id = idValido(req.params.id);
  if (!id) return res.status(400).json({ error: 'El id debe ser un número' });

  const encontrada = await servicio.obtener(id);
  if (!encontrada) return res.status(404).json({ error: 'Instalación no encontrada' });

  res.json(encontrada);
}

// POST /api/instalaciones  cuerpo: { nombre*, descripcion, imagen_url }
// da 201 con la creada ok , 400 si faltan datos o son muy largos
async function crear(req, res) {
  const body = req.body || {};

  const falta = faltantes(body, OBLIGATORIOS);
  if (falta.length) return res.status(400).json({ error: 'Faltan campos obligatorios', campos: falta });

  const datos = tomar(body, CAMPOS);
  const largos = demasiadoLargos(datos, LARGOS);
  if (largos.length) return res.status(400).json({ error: 'Estos campos son demasiado largos', campos: largos });

  try {
    const creada = await servicio.crear(datos);
    res.status(201).json(creada);
  } catch (e) {
    responderError(e, res);
  }
}

// PUT /api/instalaciones/:id nos da 200, 400, 404
async function actualizar(req, res) {
  const id = idValido(req.params.id);
  if (!id) return res.status(400).json({ error: 'El id debe ser un número' });

  const datos = tomar(req.body || {}, CAMPOS);
  if (!Object.keys(datos).length) {
    return res.status(400).json({ error: 'No se envió ningún dato para modificar' });
  }

  const vacios = faltantes(datos, OBLIGATORIOS.filter((c) => c in datos));
  if (vacios.length) return res.status(400).json({ error: 'Estos campos no pueden quedar vacíos', campos: vacios });

  const largos = demasiadoLargos(datos, LARGOS);
  if (largos.length) return res.status(400).json({ error: 'Estos campos son demasiado largos', campos: largos });

  try {
    const actualizada = await servicio.actualizar(id, datos);
    if (!actualizada) return res.status(404).json({ error: 'Instalación no encontrada' });
    res.json(actualizada);
  } catch (e) {
    responderError(e, res);
  }
}

// DELETE /api/instalaciones/:id da 204 sin cuerpo, 400, 404
async function eliminar(req, res) {
  const id = idValido(req.params.id);
  if (!id) return res.status(400).json({ error: 'El id debe ser un número' });

  const borrada = await servicio.eliminar(id);
  if (!borrada) return res.status(404).json({ error: 'Instalación no encontrada' });

  res.status(204).end();
}

module.exports = { listar, obtener, crear, actualizar, eliminar };