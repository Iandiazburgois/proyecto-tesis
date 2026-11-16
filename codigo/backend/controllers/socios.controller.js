// Nunca se devuelve password_hash en ninguna respuesta.
const servicio = require('../services/socios.service');
const { idValido, faltantes, tomar, demasiadoLargos, EMAIL_RE, responderError } = require('./validar');

const ESTADOS = ['Activo', 'Inactivo', 'Baja solicitada'];
const ROLES = ['socio', 'admin'];

// Largo máximo de cada columna (VARCHAR)
const LARGOS_PERFIL = { nombre: 100, apellido: 100, telefono: 30, email: 150 };
const LARGOS_ADMIN = { categoria: 50 };

// GET /api/socios/me → 200
async function verMiPerfil(req, res) {
  const socio = await servicio.verMiPerfil(req.usuario.id);
  if (!socio) return res.status(404).json({ error: 'Socio no encontrado' });
  res.json(socio);
}

// PUT /api/socios/me  cuerpo: { nombre, apellido, telefono, email } → 200, 400, 409 email repetido
async function actualizarMiPerfil(req, res) {
  const datos = tomar(req.body || {}, ['nombre', 'apellido', 'telefono', 'email']);
  if (!Object.keys(datos).length) return res.status(400).json({ error: 'No se envió ningún dato para modificar' });
  const vacios = faltantes(datos, Object.keys(datos).filter((c) => c !== 'telefono'));
  if (vacios.length) return res.status(400).json({ error: 'Estos campos no pueden quedar vacíos', campos: vacios });
  const largos = demasiadoLargos(datos, LARGOS_PERFIL);
  if (largos.length) return res.status(400).json({ error: 'Hay campos demasiado largos', campos: largos });
  if (datos.email !== undefined) {
    if (!EMAIL_RE.test(datos.email)) return res.status(400).json({ error: 'El email no tiene un formato válido' });
    datos.email = String(datos.email).trim().toLowerCase();
  }
  try {
    const socio = await servicio.actualizarMiPerfil(req.usuario.id, datos);
    if (!socio) return res.status(404).json({ error: 'Socio no encontrado' });
    res.json(socio);
  } catch (e) {
    responderError(e, res);
  }
}

// PUT /api/socios/me/password  cuerpo: { actual*, nueva* } → 204, 400
async function cambiarPassword(req, res) {
  const { actual, nueva } = req.body || {};
  if (!actual || !nueva) return res.status(400).json({ error: 'Enviá actual y nueva' });
  if (String(nueva).length < 6) {
    return res.status(400).json({ error: 'La contraseña nueva debe tener al menos 6 caracteres' });
  }
  try {
    const ok = await servicio.cambiarPassword(req.usuario.id, String(actual), String(nueva));
    if (!ok) return res.status(404).json({ error: 'Socio no encontrado' });
    res.status(204).end();
  } catch (e) {
    responderError(e, res);
  }
}

// POST /api/socios/me/baja → 200, 409 si ya la había solicitado
async function solicitarBaja(req, res) {
  try {
    const socio = await servicio.solicitarBaja(req.usuario.id);
    if (!socio) return res.status(404).json({ error: 'Socio no encontrado' });
    res.json(socio);
  } catch (e) {
    responderError(e, res);
  }
}

// GET /api/socios (admin) → 200  
async function listar(req, res) {
  const { estado, q } = req.query;
  res.json(await servicio.listar({ estado, q }));
}

// GET /api/socios/:id (admin) → 200, 400, 404
async function obtener(req, res) {
  const id = idValido(req.params.id);
  if (!id) return res.status(400).json({ error: 'El id debe ser un número' });
  const socio = await servicio.obtener(id);
  if (!socio) return res.status(404).json({ error: 'Socio no encontrado' });
  res.json(socio);
}

// PUT /api/socios/:id (admin)  cuerpo: { estado, categoria, rol } → 200, 400, 404
async function actualizar(req, res) {
  const id = idValido(req.params.id);
  if (!id) return res.status(400).json({ error: 'El id debe ser un número' });
  const datos = tomar(req.body || {}, ['estado', 'categoria', 'rol']);
  if (!Object.keys(datos).length) return res.status(400).json({ error: 'No se envió ningún dato para modificar' });
  if (datos.estado !== undefined && !ESTADOS.includes(datos.estado)) {
    return res.status(400).json({ error: `estado debe ser uno de: ${ESTADOS.join(', ')}` });
  }
  if (datos.rol !== undefined && !ROLES.includes(datos.rol)) {
    return res.status(400).json({ error: `rol debe ser uno de: ${ROLES.join(', ')}` });
  }
  if (datos.categoria !== undefined && !String(datos.categoria).trim()) {
    return res.status(400).json({ error: 'categoria no puede quedar vacía' });
  }
  const largos = demasiadoLargos(datos, LARGOS_ADMIN);
  if (largos.length) return res.status(400).json({ error: 'Hay campos demasiado largos', campos: largos });
  const socio = await servicio.actualizar(id, datos);
  if (!socio) return res.status(404).json({ error: 'Socio no encontrado' });
  res.json(socio);
}

// DELETE /api/socios/:id (admin) → 204, 400, 404
async function eliminar(req, res) {
  const id = idValido(req.params.id);
  if (!id) return res.status(400).json({ error: 'El id debe ser un número' });
  if (!(await servicio.eliminar(id))) return res.status(404).json({ error: 'Socio no encontrado' });
  res.status(204).end();
}

module.exports = {
  verMiPerfil, actualizarMiPerfil, cambiarPassword, solicitarBaja,
  listar, obtener, actualizar, eliminar,
};