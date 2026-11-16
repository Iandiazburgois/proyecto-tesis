const { ErrorDeNegocio, ErrorDeDatos } = require('../utils/errores');
// Máximo de un INTEGER en PostgreSQL. Un id más grande hace fallar la consulta (500).
const ID_MAXIMO = 2147483647;
// req.params.id siempre llega como texto. Devuelve el número, o null si no es un entero positivo.
function idValido(valor) {
  const n = Number(valor);
  return Number.isInteger(n) && n > 0 && n <= ID_MAXIMO ? n : null;
}

// Devuelve la lista de campos obligatorios que faltan o vienen vacíos.
function faltantes(obj, campos) {
  return campos.filter((c) => obj[c] === undefined || obj[c] === null || String(obj[c]).trim() === '');
}

// Copia del body solo los campos permitidos, cualquier otro se ignora.
function tomar(body, campos) {
  const datos = {};
  for (const c of campos) if (body[c] !== undefined) datos[c] = body[c];
  return datos;
}

// Devuelve los campos que superan el largo máximo de su columna (VARCHAR(n)).
function demasiadoLargos(obj, limites) {
  return Object.keys(limites).filter(
    (c) => obj[c] !== undefined && obj[c] !== null && String(obj[c]).length > limites[c]
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// "AAAA-MM-DD" y que la fecha exista (2026-02-30 no existe).
function esFecha(valor) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(valor))) return false;
  const d = new Date(`${valor}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === valor;
}

// "HH:MM" (o "HH:MM:SS") entre 00:00 y 23:59.
function esHora(valor) {
  return /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(String(valor));
}

// El catch de errores.js
// Un error que no es nuestro se relanza: llega al middleware del final de app.js (500).
function responderError(e, res) {
  if (e instanceof ErrorDeDatos) return res.status(400).json({ error: e.message });
  if (e instanceof ErrorDeNegocio) return res.status(409).json({ error: e.message });
  throw e;
}

module.exports = { idValido, faltantes, demasiadoLargos, tomar, EMAIL_RE, esFecha, esHora, responderError };
