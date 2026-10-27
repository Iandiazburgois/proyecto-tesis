const servicio = require('../services/cuotas.service');

// GET /api/cuotas/mias
async function misCuotas(req, res) {
  res.status(501).json({ error: 'Sin implementar' });
}

// PUT /api/cuotas/:id/comprobante
async function enviarComprobante(req, res) {
  res.status(501).json({ error: 'Sin implementar' });
}

// GET /api/cuotas (admin)
async function listar(req, res) {
  res.status(501).json({ error: 'Sin implementar' });
}

// GET /api/cuotas/:id (admin)
async function obtener(req, res) {
  res.status(501).json({ error: 'Sin implementar' });
}

// POST /api/cuotas (admin)
async function crear(req, res) {
  res.status(501).json({ error: 'Sin implementar' });
}

// PUT /api/cuotas/:id (admin)
async function actualizar(req, res) {
  res.status(501).json({ error: 'Sin implementar' });
}

// DELETE /api/cuotas/:id (admin)
async function eliminar(req, res) {
  res.status(501).json({ error: 'Sin implementar' });
}

module.exports = { misCuotas, enviarComprobante, listar, obtener, crear, actualizar, eliminar };
