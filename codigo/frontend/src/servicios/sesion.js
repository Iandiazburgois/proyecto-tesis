// Guarda y lee la sesión en localStorage, para que no se pierda al recargar la página

export function guardarSesion(token, socio) {
  localStorage.setItem('token', token);
  localStorage.setItem('socio', JSON.stringify(socio));
}

export function cerrarSesion() {
  localStorage.removeItem('token');
  localStorage.removeItem('socio');
}

export function haySesion() {
  return localStorage.getItem('token') !== null;
}

// Devuelve los datos del socio que inició sesión, o null si no hay sesión
export function leerSocio() {
  const socio = localStorage.getItem('socio');
  return socio ? JSON.parse(socio) : null;
}

export function esAdmin() {
  return leerSocio()?.rol === 'admin';
}