const servicio = require('../services/grupoFamilia.service');
const { idValido, faltantes, tomar, demasiadoLargos, responderError } = require('./validar');

// El socio titular sale SIEMPRE de la sesión (req.usuario.id), nunca del cuerpo ni de la URL.
// Así nadie puede ver ni tocar la familia de otro socio.

const CAMPOS = ['nombre', 'apellido', 'dni', 'parentesco', 'dni_frente_url', 'dni_dorso_url'];
const OBLIGATORIOS = ['nombre', 'apellido', 'dni', 'parentesco'];
const LARGOS = { nombre: 100, apellido: 100, dni: 20, parentesco: 50, dni_frente_url: 255, dni_dorso_url: 255 };

// GET /api/grupo-familia → 200 con los familiares del socio logueado
async function listar(req, res) {
  const familiares = await servicio.listar(req.usuario.id);
  res.json(familiares);
}

// GET /api/grupo-familia/:id da 200, 400, 404 (también si es de otro socio)
async function obtener(req, res) {
  const id = idValido(req.params.id);
  if (!id) return res.status(400).json({ error: 'El id debe ser un número' });

  const familiar = await servicio.obtener(id, req.usuario.id);
  if (!familiar) return res.status(404).json({ error: 'Familiar no encontrado' });

  res.json(familiar);
}

// POST /api/grupo-familia  cuerpo: { nombre*, apellido*, dni*, parentesco*, dni_frente_url, dni_dorso_url }
// lanza 201, 400 si faltan datos, 409 si ese DNI ya está en su grupo
async function crear(req, res) {
  const body = req.body || {};

  const falta = faltantes(body, OBLIGATORIOS);
  if (falta.length) return res.status(400).json({ error: 'Faltan campos obligatorios', campos: falta });

  const datos = tomar(body, CAMPOS);
  datos.dni = String(datos.dni).trim();
  const largos = demasiadoLargos(datos, LARGOS);
  if (largos.length) return res.status(400).json({ error: 'Estos campos son demasiado largos', campos: largos });

  try {
    const creado = await servicio.crear(datos, req.usuario.id);
    res.status(201).json(creado);
  } catch (e) {
    responderError(e, res);
  }
}

// PUT /api/grupo-familia/:id da 200, 400, 404, 409
async function actualizar(req, res) {
  const id = idValido(req.params.id);
  if (!id) return res.status(400).json({ error: 'El id debe ser un número' });

  const datos = tomar(req.body || {}, CAMPOS);
  if (!Object.keys(datos).length) {
    return res.status(400).json({ error: 'No se envió ningún dato para modificar' });
  }

  const vacios = faltantes(datos, OBLIGATORIOS.filter((c) => c in datos));
  if (vacios.length) return res.status(400).json({ error: 'Estos campos no pueden quedar vacíos', campos: vacios });

  if (datos.dni !== undefined) datos.dni = String(datos.dni).trim();
  const largos = demasiadoLargos(datos, LARGOS);
  if (largos.length) return res.status(400).json({ error: 'Estos campos son demasiado largos', campos: largos });

  try {
    const familiar = await servicio.actualizar(id, datos, req.usuario.id);
    if (!familiar) return res.status(404).json({ error: 'Familiar no encontrado' });
    res.json(familiar);
  } catch (e) {
    responderError(e, res);
  }
}

// DELETE /api/grupo-familia/:id da 204, 400, 404
async function eliminar(req, res) {
  const id = idValido(req.params.id);
  if (!id) return res.status(400).json({ error: 'El id debe ser un número' });

  const borrado = await servicio.eliminar(id, req.usuario.id);
  if (!borrado) return res.status(404).json({ error: 'Familiar no encontrado' });

  res.status(204).end();
}

module.exports = { listar, obtener, crear, actualizar, eliminar };