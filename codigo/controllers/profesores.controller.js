const servicio = require('../services/profesores.service');

// GET /api/profesores
async function listar(req, res) {
  res.status(501).json({ error: 'Sin implementar' });
}

// GET /api/profesores/:id
async function obtener(req, res) {
  res.status(501).json({ error: 'Sin implementar' });
}

// POST /api/profesores
async function crear(req, res) {
  res.status(501).json({ error: 'Sin implementar' });
}

// PUT /api/profesores/:id
async function actualizar(req, res) {
  res.status(501).json({ error: 'Sin implementar' });
}

// DELETE /api/profesores/:id
async function eliminar(req, res) {
  res.status(501).json({ error: 'Sin implementar' });
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
