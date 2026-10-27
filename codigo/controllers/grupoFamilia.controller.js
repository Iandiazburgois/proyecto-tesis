const servicio = require('../services/grupoFamilia.service');

// GET /api/grupo-familia
async function listar(req, res) {
  res.status(501).json({ error: 'Sin implementar' });
}

// GET /api/grupo-familia/:id
async function obtener(req, res) {
  res.status(501).json({ error: 'Sin implementar' });
}

// POST /api/grupo-familia
async function crear(req, res) {
  res.status(501).json({ error: 'Sin implementar' });
}

// PUT /api/grupo-familia/:id 
async function actualizar(req, res) {
  res.status(501).json({ error: 'Sin implementar' });
}

// DELETE /api/grupo-familia/:id 
async function eliminar(req, res) {
  res.status(501).json({ error: 'Sin implementar' });
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
