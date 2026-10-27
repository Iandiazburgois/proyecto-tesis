// Va después de autenticacion. Si req.usuario.rol no es 'admin' → 403.
// 401 = no sé quién sos. 403 = sé quién sos, y no podés hacer esto.
function soloAdmin(req, res, next) {
  if (!req.usuario || req.usuario.rol !== 'admin') {
    return res.status(403).json({ error: 'No tenés permiso para esto' });
  }
  next();
}

module.exports = soloAdmin;
