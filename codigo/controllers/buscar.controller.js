const servicio = require('../services/buscar.service');

// GET /api/buscar?q=texto
// → 200 { busqueda, total, novedades, actividades, instalaciones }
//   Si no encuentra nada: 200 con total 0 y listas vacías (no es un error).
// → 400 si falta q o está vacío
async function buscar(req, res) {
  res.status(501).json({ error: 'Sin implementar' });
}

module.exports = { buscar };
