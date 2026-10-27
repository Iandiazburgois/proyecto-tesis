// Nunca se devuelve password_hash en ninguna respuesta.
const servicio = require('../services/socios.service');

// GET /api/socios/me
async function verMiPerfil(req, res) {
  res.status(501).json({ error: 'Sin implementar' });
}

// PUT /api/socios/me
async function actualizarMiPerfil(req, res) {
  res.status(501).json({ error: 'Sin implementar' });
}

// PUT /api/socios/me/password
async function cambiarPassword(req, res) {
  res.status(501).json({ error: 'Sin implementar' });
}

// POST /api/socios/me/baja
async function solicitarBaja(req, res) {
  res.status(501).json({ error: 'Sin implementar' });
}

// GET /api/socios (admin)
async function listar(req, res) {
  res.status(501).json({ error: 'Sin implementar' });
}

// GET /api/socios/:id (admin)
async function obtener(req, res) {
  res.status(501).json({ error: 'Sin implementar' });
}

// PUT /api/socios/:id (admin)
async function actualizar(req, res) {
  res.status(501).json({ error: 'Sin implementar' });
}

// DELETE /api/socios/:id (admin)
async function eliminar(req, res) {
  res.status(501).json({ error: 'Sin implementar' });
}

module.exports = {
  verMiPerfil, actualizarMiPerfil, cambiarPassword, solicitarBaja,
  listar, obtener, actualizar, eliminar,
};
