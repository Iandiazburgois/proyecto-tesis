const servicio = require('../services/auth.service');

// POST /api/auth/registro
async function registro(req, res) {
  res.status(501).json({ error: 'Sin implementar' });
}

// POST /api/auth/login
async function login(req, res) {
  res.status(501).json({ error: 'Sin implementar' });
}

module.exports = { registro, login };
