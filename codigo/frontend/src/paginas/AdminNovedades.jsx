import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import CabeceraPantalla from '../componentes/CabeceraPantalla';
import Tarjeta from '../componentes/Tarjeta';
import Icono from '../componentes/Icono';
import { Cargando, ErrorCarga, Mensaje, Vacio } from '../componentes/Estados';
import { pedir } from '../servicios/api';
import { cerrarSesion } from '../servicios/sesion';
import './AdminNovedades.css';

// Admin — Novedades (11 del prototipo)
// API: GET /novedades y DELETE /novedades/:id

// "2026-10-20 18:30:00" → "20/10/2026"
function fechaCorta(fecha) {
  const [anio, mes, dia] = fecha.slice(0, 10).split('-');
  return `${dia}/${mes}/${anio}`;
}

export default function AdminNovedades() {
  const navegar = useNavigate();
  const ubicacion = useLocation();

  const [novedades, setNovedades] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [intento, setIntento] = useState(0);

  // Aviso de lo último que se hizo. Si venimos de publicar, trae ese mensaje
  const [aviso, setAviso] = useState(
    ubicacion.state?.mensaje ? { tipo: 'exito', texto: ubicacion.state.mensaje } : null
  );
  // Id de la novedad que se está borrando, para desactivar solo ese botón
  const [borrando, setBorrando] = useState(null);

  useEffect(() => {
    async function cargar() {
      try {
        setNovedades(await pedir('/novedades'));
      } catch (e) {
        setError(e.message);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, [intento]);

  function reintentar() {
    setError('');
    setCargando(true);
    setIntento(intento + 1);
  }

  async function borrar(novedad) {
    if (!window.confirm(`¿Seguro que querés borrar “${novedad.titulo}”?`)) return;
    setBorrando(novedad.id_novedad);
    setAviso(null);
    try {
      await pedir(`/novedades/${novedad.id_novedad}`, 'DELETE');
      // La sacamos de la lista sin volver a pedir todas
      setNovedades(novedades.filter((n) => n.id_novedad !== novedad.id_novedad));
      setAviso({ tipo: 'exito', texto: 'Se borró la novedad.' });
    } catch (e) {
      setAviso({ tipo: 'error', texto: e.message });
    } finally {
      setBorrando(null);
    }
  }

  function salir() {
    cerrarSesion();
    navegar('/ingresar');
  }

  let contenido;
  if (cargando) {
    contenido = <Cargando texto="Cargando las novedades…" />;
  } else if (error) {
    contenido = <ErrorCarga mensaje={error} alReintentar={reintentar} />;
  } else if (novedades.length === 0) {
    contenido = (
      <Vacio icono="article" titulo="Todavía no hay novedades">
        Publicá la primera con “Publicar novedad”.
      </Vacio>
    );
  } else {
    contenido = (
      <div className="lista-tarjetas">
        {novedades.map((n) => (
          <Tarjeta key={n.id_novedad} titulo={n.titulo} texto={fechaCorta(n.fecha_publicacion)}>
            <button
              type="button"
              className="boton boton--secundario admin-novedades__borrar"
              onClick={() => borrar(n)}
              disabled={borrando === n.id_novedad}
            >
              {borrando === n.id_novedad ? 'Borrando…' : 'Borrar'}
            </button>
          </Tarjeta>
        ))}
      </div>
    );
  }

  return (
    <div className="admin-novedades">
      <CabeceraPantalla titulo="Novedades" volverA="/admin" />

      <Link to="/admin/novedades/nueva" className="admin-novedades__publicar">
        <Icono nombre="add" />
        Publicar novedad
      </Link>

      {aviso && <Mensaje tipo={aviso.tipo}>{aviso.texto}</Mensaje>}

      {contenido}

      <div className="admin-novedades__acciones">
        <button type="button" className="boton boton--primario" onClick={salir}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}