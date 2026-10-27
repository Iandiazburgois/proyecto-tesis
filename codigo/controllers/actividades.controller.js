const servicio = require('../services/actividades.service');

// GET /api/actividades
async function listar(req, res) {
  res.status(501).json({ error: 'Sin implementar' });
}

// GET /api/actividades/:id
async function obtener(req, res) {
  res.status(501).json({ error: 'Sin implementar' });
}

// POST /api/actividades
async function crear(req, res) {
  res.status(501).json({ error: 'Sin implementar' });
}

// PUT /api/actividades/:id
async function actualizar(req, res) {
  res.status(501).json({ error: 'Sin implementar' });
}

// DELETE /api/actividades/:id
async function eliminar(req, res) {
  res.status(501).json({ error: 'Sin implementar' });
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
