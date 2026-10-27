// Protege las rutas que necesitan sesión.
const jwt = require('jsonwebtoken');

function autenticacion(req, res, next) {
  // Si no viene el encabezado, usamos '' para que split no falle con undefined
  const [tipo, token] = (req.headers.authorization ?? '').split(' ');
  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Hace falta iniciar sesión' });
  }
  try {
    // verify (y no decode) comprueba la firma y el vencimiento:
    // un token modificado o vencido lanza un error y cae en el catch
    const datos = jwt.verify(token, process.env.JWT_SECRET);
    // soloAdmin y los controladores leen req.usuario sin volver a la base
    req.usuario = { id: datos.id, email: datos.email, rol: datos.rol };
    next();
  } catch (e) {
    // 401 y no 403: si el token no sirve, no sabemos quién es
    return res.status(401).json({ error: 'La sesión no es válida o venció' });
  }
}

module.exports = autenticacion;