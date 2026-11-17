// Reglas de validación que se usan en varios formularios

// algo@algo.algo, sin espacios
export function esEmail(texto) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(texto);
}

// 7 u 8 números, sin puntos
export function esDni(texto) {
  return /^\d{7,8}$/.test(texto);
}

// Años cumplidos a hoy, a partir de "AAAA-MM-DD" (lo que devuelve un input type="date")
export function edad(fecha) {
  const hoy = new Date();
  const nacimiento = new Date(`${fecha}T00:00:00`);
  let anios = hoy.getFullYear() - nacimiento.getFullYear();
  // Si este año todavía no cumplió, se resta uno
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) anios--;
  return anios;
}