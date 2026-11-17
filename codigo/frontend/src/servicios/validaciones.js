// Reglas de validación que se usan en varios formularios

// algo@algo.algo, sin espacios
export function esEmail(texto) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(texto);
}

// 7 u 8 números, sin puntos
export function esDni(texto) {
  return /^\d{7,8}$/.test(texto);
}