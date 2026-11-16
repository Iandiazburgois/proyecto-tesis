const servicio = require('../services/sponsors.service');
const { idValido, faltantes, tomar, demasiadoLargos, responderError } = require('./validar');

const CAMPOS = ['nombre', 'logo_url'];
const OBLIGATORIOS = ['nombre'];
const LARGOS = { nombre: 100, logo_url: 255 };

// GET /api/sponsors → 200 con la lista
async function listar(req, res) {
  const lista = await servicio.listar();
  res.json(lista);
}

// GET /api/sponsors/:id → 200, 400 si el id no es válido, 404 si no existe
async function obtener(req, res) {
  const id = idValido(req.params.id);
  if (!id) return res.status(400).json({ error: 'El id debe ser un número' });

  const encontrado = await servicio.obtener(id);
  if (!encontrado) return res.status(404).json({ error: 'Sponsor no encontrado' });

  res.json(encontrado);
}

// POST /api/sponsors  cuerpo: { nombre*, logo_url }
// → 201 con el creado, 400 si faltan datos o son muy largos
async function crear(req, res) {
  const body = req.body || {};

  const falta = faltantes(body, OBLIGATORIOS);
  if (falta.length) return res.status(400).json({ error: 'Faltan campos obligatorios', campos: falta });

  const datos = tomar(body, CAMPOS);
  const largos = demasiadoLargos(datos, LARGOS);
  if (largos.length) return res.status(400).json({ error: 'Estos campos son demasiado largos', campos: largos });

  try {
    const creado = await servicio.crear(datos);
    res.status(201).json(creado);
  } catch (e) {
    responderError(e, res);
  }
}

// PUT /api/sponsors/:id → 200, 400, 404
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
    const actualizado = await servicio.actualizar(id, datos);
    if (!actualizado) return res.status(404).json({ error: 'Sponsor no encontrado' });
    res.json(actualizado);
  } catch (e) {
    responderError(e, res);
  }
}

// DELETE /api/sponsors/:id → 204 sin cuerpo, 400, 404
async function eliminar(req, res) {
  const id = idValido(req.params.id);
  if (!id) return res.status(400).json({ error: 'El id debe ser un número' });

  const borrado = await servicio.eliminar(id);
  if (!borrado) return res.status(404).json({ error: 'Sponsor no encontrado' });

  res.status(204).end();
}

module.exports = { listar, obtener, crear, actualizar, eliminar };