const servicio = require('../services/auth.service');
const { faltantes, demasiadoLargos, EMAIL_RE, esFecha, responderError } = require('./validar');

// Largo máximo de cada columna (VARCHAR)
const LARGOS_SOCIO = { nombre: 100, apellido: 100, email: 150, telefono: 30, dni_frente_url: 255, dni_dorso_url: 255 };
const LARGOS_FAMILIAR = { nombre: 100, apellido: 100, parentesco: 50, dni_frente_url: 255, dni_dorso_url: 255 };

// POST /api/auth/registro
// cuerpo: { socio: { nombre*, apellido*, dni*, email*, password*, fecha_nacimiento*, telefono,
//                    dni_frente_url, dni_dorso_url }, familiares: [ ... ] }
// → 201 con el socio creado (sin password_hash), 400 si faltan datos o son inválidos,
//   409 si ya existe ese email o DNI
async function registro(req, res) {
  const b = req.body || {};
  const s = b.socio;
  const familiares = b.familiares ?? [];

  if (!s || typeof s !== 'object') {
    return res.status(400).json({ error: 'Falta el objeto socio en el cuerpo' });
  }
  const falta = faltantes(s, ['nombre', 'apellido', 'dni', 'email', 'password', 'fecha_nacimiento']);
  if (falta.length) return res.status(400).json({ error: 'Faltan campos obligatorios', campos: falta });
  if (!EMAIL_RE.test(s.email)) return res.status(400).json({ error: 'El email no tiene un formato válido' });
  if (String(s.password).length < 6) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
  }
  if (!esFecha(s.fecha_nacimiento)) {
    return res.status(400).json({ error: 'fecha_nacimiento tiene que ser una fecha válida AAAA-MM-DD' });
  }
  if (String(s.dni).trim().length > 20) return res.status(400).json({ error: 'El DNI no puede tener más de 20 caracteres' });
  const largos = demasiadoLargos(s, LARGOS_SOCIO);
  if (largos.length) return res.status(400).json({ error: 'Hay campos demasiado largos', campos: largos });

  if (!Array.isArray(familiares)) return res.status(400).json({ error: 'familiares tiene que ser una lista' });
  for (const [i, f] of familiares.entries()) {
    const faltaF = faltantes(f || {}, ['nombre', 'apellido', 'dni', 'parentesco']);
    if (faltaF.length) return res.status(400).json({ error: `Faltan datos del familiar ${i + 1}`, campos: faltaF });
    if (String(f.dni).trim().length > 20) {
      return res.status(400).json({ error: `El DNI del familiar ${i + 1} no puede tener más de 20 caracteres` });
    }
    const largosF = demasiadoLargos(f, LARGOS_FAMILIAR);
    if (largosF.length) {
      return res.status(400).json({ error: `Hay datos demasiado largos en el familiar ${i + 1}`, campos: largosF });
    }
  }

  try {
    // Se arma campo por campo: aunque el cuerpo traiga "rol": "admin", no pasa.
    const socio = await servicio.registrar({
      nombre: s.nombre,
      apellido: s.apellido,
      dni: String(s.dni).trim(),
      email: String(s.email).trim().toLowerCase(),
      password: String(s.password),
      telefono: s.telefono,
      fecha_nacimiento: s.fecha_nacimiento,
      dni_frente_url: s.dni_frente_url,
      dni_dorso_url: s.dni_dorso_url,
    }, familiares);
    res.status(201).json(socio);
  } catch (e) {
    responderError(e, res);
  }
}

// POST /api/auth/login  cuerpo: { usuario*, password* }  (usuario = email o DNI)
// → 200 { token, socio }, 400 si faltan datos, 401 si no coinciden
async function login(req, res) {
  const { usuario, password } = req.body || {};
  if (!usuario || !password) {
    return res.status(400).json({ error: 'Ingresá usuario (email o DNI) y contraseña' });
  }
  const resultado = await servicio.iniciarSesion(String(usuario).trim(), String(password));
  if (!resultado) return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
  res.json(resultado);
}

module.exports = { registro, login };