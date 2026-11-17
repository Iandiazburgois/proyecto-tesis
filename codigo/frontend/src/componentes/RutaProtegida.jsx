import { Navigate, Outlet, useLocation } from 'react-router';
import { esAdmin, haySesion } from '../servicios/sesion';

// Protege las pantallas que piden sesión (R3).
// Con soloAdmin, además exige que el usuario sea administrador.
export default function RutaProtegida({ soloAdmin = false }) {
  const ubicacion = useLocation();

  // Sin sesión: al login, recordando a qué pantalla quería entrar
  if (!haySesion()) {
    return <Navigate to="/ingresar" replace state={{ desde: ubicacion.pathname }} />;
  }

  // Un socio común que intenta entrar al panel de admin vuelve a su área
  if (soloAdmin && !esAdmin()) {
    return <Navigate to="/socios" replace />;
  }

  // Tiene permiso: se muestra la pantalla que corresponde
  return <Outlet />;
}