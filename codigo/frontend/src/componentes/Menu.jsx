import { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { cerrarSesion, esAdmin, haySesion } from '../servicios/sesion';
import Icono from './Icono';
import './Menu.css';

// Menú lateral del prototipo (07).
// "abierto" y "alCerrar" los manda el Encabezado, que es quien tiene el botón "Menú".
export default function Menu({ abierto, alCerrar }) {
  const navegar = useNavigate();

  // Con el menú abierto, la tecla Esc lo cierra
  useEffect(() => {
    if (!abierto) return;

    function conTecla(evento) {
      if (evento.key === 'Escape') alCerrar();
    }
    document.addEventListener('keydown', conTecla);

    // Al cerrarse, se deja de escuchar el teclado
    return () => document.removeEventListener('keydown', conTecla);
  }, [abierto, alCerrar]);

  // Cerrado: no se dibuja nada
  if (!abierto) return null;

  function salir() {
    cerrarSesion();
    alCerrar();
    navegar('/');
  }

  return (
    // Tocar el fondo oscuro cierra el menú
    <div className="menu__fondo" onClick={alCerrar}>
      {/* stopPropagation: un clic adentro del menú no llega al fondo, así no se cierra */}
      <nav className="menu" aria-label="Menú" onClick={(e) => e.stopPropagation()}>
        <div className="menu__encabezado">
          <h2>Menú</h2>
          <button type="button" className="menu__cerrar" onClick={alCerrar} aria-label="Cerrar el menú">
            <Icono nombre="close" />
          </button>
        </div>

        <ul className="menu__lista">
          <li><NavLink to="/" end onClick={alCerrar}>Inicio</NavLink></li>
          <li><NavLink to="/buscar" onClick={alCerrar}>Buscar</NavLink></li>

          {/* Las opciones cambian si hay sesión o no */}
          {haySesion() ? (
            <>
              <li>
                <NavLink to={esAdmin() ? '/admin' : '/socios'} onClick={alCerrar}>
                  {esAdmin() ? 'Administración' : 'Área de socios'}
                </NavLink>
              </li>
              <li><button type="button" onClick={salir}>Cerrar sesión</button></li>
            </>
          ) : (
            <>
              <li><NavLink to="/hacete-socio" onClick={alCerrar}>Hacete socio</NavLink></li>
              <li><NavLink to="/ingresar" onClick={alCerrar}>Ingresar</NavLink></li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
}