const servicio = require('../services/novedades.service');

// GET /api/novedades
async function listar(req, res) {
  const novedades = await servicio.listar();
  res.json(novedades);
}

// GET /api/novedades/:id 
async function obtener(req, res) {
  res.status(501).json({ error: 'Sin implementar' });
}

// POST /api/novedades
async function crear(req, res) {
  res.status(501).json({ error: 'Sin implementar' });
}

// PUT /api/novedades/:id 
async function actualizar(req, res) {
  res.status(501).json({ error: 'Sin implementar' });
}

// DELETE /api/novedades/:id
async function eliminar(req, res) {
  res.status(501).json({ error: 'Sin implementar' });
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
