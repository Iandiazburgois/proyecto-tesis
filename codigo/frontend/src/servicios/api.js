// Conexión con el backend: todos los pedidos a la API pasan por acá
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Mensajes por defecto si el backend no manda uno
const MENSAJES = {
  400: 'Revisá los datos ingresados.',
  401: 'Tenés que iniciar sesión para ver esto.',
  403: 'No tenés permiso para hacer esto.',
  404: 'No encontramos lo que buscabas.',
  409: 'Ese dato ya está registrado.',
  500: 'Hubo un problema en el servidor. Probá de nuevo en unos minutos.',
};

// Ejemplo: pedir('/novedades') o pedir('/auth/login', 'POST', { usuario, password })
export async function pedir(ruta, metodo = 'GET', cuerpo) {
  const encabezados = { 'Content-Type': 'application/json' };

  // Si hay sesión, se manda el token
  const token = localStorage.getItem('token');
  if (token) {
    encabezados.Authorization = `Bearer ${token}`;
  }

  let respuesta;
  try {
    respuesta = await fetch(BASE + ruta, {
      method: metodo,
      headers: encabezados,
      body: cuerpo ? JSON.stringify(cuerpo) : undefined,
    });
  } catch {
    // No se pudo llegar al servidor (apagado o sin internet)
    throw new Error('No pudimos conectarnos con el servidor. Revisá tu conexión e intentá de nuevo.');
  }

  // 204: no hay contenido para leer
  if (respuesta.status === 204) {
    return null;
  }

  const datos = await respuesta.json().catch(() => null);

  // fetch no falla con un 404 o un 500, por eso se revisa ok
  if (!respuesta.ok) {
    // Sesión vencida: se borra y se vuelve al login
    if (respuesta.status === 401 && token) {
      localStorage.removeItem('token');
      localStorage.removeItem('socio');
      window.location.assign('/ingresar');
    }
    const error = new Error(datos?.error || MENSAJES[respuesta.status] || 'Algo salió mal. Probá de nuevo.');
    error.estado = respuesta.status;
    throw error;
  }

  return datos;
}