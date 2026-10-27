const servicio = require('../services/sponsors.service');

// GET /api/sponsors
async function listar(req, res) {
  res.status(501).json({ error: 'Sin implementar' });
}

// GET /api/sponsors/:id
async function obtener(req, res) {
  res.status(501).json({ error: 'Sin implementar' });
}

// POST /api/sponsors  
async function crear(req, res) {
  res.status(501).json({ error: 'Sin implementar' });
}

// PUT /api/sponsors/:id 
async function actualizar(req, res) {
  res.status(501).json({ error: 'Sin implementar' });
}

// DELETE /api/sponsors/:id
async function eliminar(req, res) {
  res.status(501).json({ error: 'Sin implementar' });
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
