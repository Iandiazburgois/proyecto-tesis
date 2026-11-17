import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { esAdmin, leerSocio } from '../servicios/sesion';
import Icono from './Icono';
import Menu from './Menu';
import './Encabezado.css';

// Encabezado del prototipo: escudo, nombre del club, Menú, Buscar e Ingresar.
export default function Encabezado() {
  // Guarda si el menú lateral está abierto o cerrado
  const [menuAbierto, setMenuAbierto] = useState(false);

  // useLocation hace que el encabezado se vuelva a dibujar al cambiar de pantalla.
  // Así, después de iniciar o cerrar sesión, muestra el nombre o "Ingresar" según corresponda.
  useLocation();
  const socio = leerSocio();

  return (
    <header className="encabezado">
      <div className="encabezado__contenido contenedor">
        <Link to="/" className="encabezado__marca">
          <img src="/escudo.png" alt="" width="48" height="48" />
          <span>Club Sportivo San Cayetano</span>
        </Link>

        <nav className="encabezado__nav" aria-label="Principal">
          {/* Botón del menú: solo en el celular */}
          <button
            type="button"
            className="encabezado__accion encabezado__boton-menu"
            aria-expanded={menuAbierto}
            onClick={() => setMenuAbierto(true)}
          >
            <Icono nombre="menu" />
            Menú
          </button>

          {/* Solo en pantalla ancha (wireframe HOME de PC): accesos a las secciones del Inicio.
              En el celular no van, porque el Inicio se recorre bajando. */}
          <a href="#historia" className="encabezado__accion encabezado__solo-ancho">Nuestra historia</a>
          <a href="#actividades" className="encabezado__accion encabezado__solo-ancho">Actividades</a>
          <a href="#novedades" className="encabezado__accion encabezado__solo-ancho">Novedades</a>
          <a href="#instalaciones" className="encabezado__accion encabezado__solo-ancho">Instalaciones</a>

          <NavLink to="/buscar" className="encabezado__accion">
            <Icono nombre="search" />
            Buscar
          </NavLink>

          {/* Con sesión: el nombre del socio (pantalla 01b). Sin sesión: Ingresar */}
          {socio ? (
            <NavLink to={esAdmin() ? '/admin' : '/socios'} className="encabezado__accion">
              <Icono nombre="person" />
              {socio.nombre}
            </NavLink>
          ) : (
            <NavLink to="/ingresar" className="encabezado__accion">
              <Icono nombre="login" />
              Ingresar
            </NavLink>
          )}
        </nav>
      </div>

      <Menu abierto={menuAbierto} alCerrar={() => setMenuAbierto(false)} />
    </header>
  );
}