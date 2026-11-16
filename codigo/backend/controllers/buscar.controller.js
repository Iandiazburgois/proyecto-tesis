const servicio = require('../services/buscar.service');
// Buscador del sitio (R4): GET /api/buscar?q=texto
// Busca en novedades, actividades e instalaciones, sin importar mayúsculas ni tildes.
// → 200 con los resultados. Si no hay ninguno, también 200, con las listas vacías.
// → 400 si falta el texto o es demasiado largo.
async function buscar(req, res) {
  const q = String(req.query.q ?? '').trim();
  if (!q) return res.status(400).json({ error: 'Falta el texto a buscar (parámetro q)' });
  if (q.length > 100) return res.status(400).json({ error: 'El texto a buscar es demasiado largo' });

  const resultados = await servicio.buscar(q);
  const total = resultados.novedades.length + resultados.actividades.length + resultados.instalaciones.length;

  res.json({ busqueda: q, total, ...resultados });
}

module.exports = { buscar };