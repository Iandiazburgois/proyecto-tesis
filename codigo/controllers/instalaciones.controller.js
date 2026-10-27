const servicio = require('../services/instalaciones.service');

// GET /api/instalaciones
async function listar(req, res) {
  res.status(501).json({ error: 'Sin implementar' });
}

// GET /api/instalaciones/:id
async function obtener(req, res) {
  res.status(501).json({ error: 'Sin implementar' });
}

// POST /api/instalaciones
async function crear(req, res) {
  res.status(501).json({ error: 'Sin implementar' });
}

// PUT /api/instalaciones/:id
async function actualizar(req, res) {
  res.status(501).json({ error: 'Sin implementar' });
}

// DELETE /api/instalaciones/:id 
async function eliminar(req, res) {
  res.status(501).json({ error: 'Sin implementar' });
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
