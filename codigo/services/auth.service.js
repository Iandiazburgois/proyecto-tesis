// Usa el repositorio de socios, el hash con bcryptjs y el token con jsonwebtoken
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const socios = require('../data/socios.repositorio');
const { ErrorDeNegocio } = require('../utils/errores');

// registrar(socio, familiares) → el socio creado, sin password_hash
//   Regla: email o DNI repetido → ErrorDeNegocio (409)
async function registrar(socio, familiares) {
  const existente = await socios.existeEmailODni(socio.email, socio.dni);
  if (existente) {
    const que = existente.email === socio.email ? `el email ${socio.email}` : `el DNI ${socio.dni}`;
    throw new ErrorDeNegocio(`Ya hay un socio registrado con ${que}`);
  }

  // La contraseña no se guarda: se guarda su hash de bcrypt
  const { password, ...resto } = socio;
  const password_hash = await bcrypt.hash(password, 10);

  // El objeto que vuelve ya viene sin el hash: el repositorio devuelve solo las columnas públicas.
  return socios.crearConFamiliares({ ...resto, password_hash }, familiares);
}

// iniciarSesion(usuario, password) → { token, socio }, o null si no coinciden (→ 401)
//   El token lleva { id: id_socio, email, rol } y se firma con process.env.JWT_SECRET.
async function iniciarSesion(usuario, password) {
  const socio = await socios.porEmailODni(usuario);
  // El usuario inexistente y la contraseña equivocada dan lo mismo (null → 401):
  // si no, cualquiera podría averiguar qué emails tienen cuenta en el club.
  if (!socio || !(await bcrypt.compare(password, socio.password_hash))) {
    return null;
  }
  const { password_hash, ...datos } = socio;
  const token = jwt.sign(
    { id: datos.id_socio, email: datos.email, rol: datos.rol },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || '1h' }
  );
  return { token, socio: datos };
}

module.exports = { registrar, iniciarSesion };
