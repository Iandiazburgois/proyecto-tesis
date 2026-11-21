import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import Tarjeta from '../componentes/Tarjeta';
import { Cargando, ErrorCarga } from '../componentes/Estados';
import { pedir } from '../servicios/api';
import { haySesion } from '../servicios/sesion';
import './Inicio.css';

// Inicio (01 y 01b del prototipo)
// API: GET /actividades, /novedades, /instalaciones y /sponsors

// En el inicio se muestran solo las últimas novedades
const CANTIDAD_NOVEDADES = 3;

// "20:00:00" → "20:00"
function hora(texto) {
  return texto.slice(0, 5);
}

// Días y horario de una actividad, si los tiene
function horario(actividad) {
  if (!actividad.dias) return '';
  if (!actividad.hora_inicio || !actividad.hora_fin) return actividad.dias;
  return `${actividad.dias} de ${hora(actividad.hora_inicio)} a ${hora(actividad.hora_fin)}`;
}

// Una sección del inicio con su título. Si la lista está vacía, avisa en vez de quedar en blanco
function Seccion({ id, titulo, vacia, children }) {
  return (
    <section id={id} className="inicio__seccion">
      <h2>{titulo}</h2>
      {vacia ? <p className="inicio__vacio">Todavía no hay nada publicado.</p> : children}
    </section>
  );
}

export default function Inicio() {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    async function cargar() {
      try {
        // Las cuatro listas se piden a la vez
        const [actividades, novedades, instalaciones, sponsors] = await Promise.all([
          pedir('/actividades'),
          pedir('/novedades'),
          pedir('/instalaciones'),
          pedir('/sponsors'),
        ]);
        setDatos({
          actividades,
          // Primero las destacadas, después las demás
          novedades: [...novedades].sort((a, b) => b.destacado - a.destacado).slice(0, CANTIDAD_NOVEDADES),
          instalaciones,
          sponsors,
        });
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

  let contenido;
  if (cargando) {
    contenido = <Cargando texto="Cargando las novedades del club…" />;
  } else if (error) {
    contenido = <ErrorCarga mensaje={error} alReintentar={reintentar} />;
  } else {
    contenido = (
      <>
        <Seccion id="actividades" titulo="Disciplinas" vacia={datos.actividades.length === 0}>
          <div className="lista-tarjetas inicio__disciplinas">
            {datos.actividades.map((a) => (
              <Tarjeta key={a.id_actividad} titulo={a.nombre} texto={a.descripcion}>
                {horario(a) && <p className="inicio__horario">{horario(a)}</p>}
              </Tarjeta>
            ))}
          </div>
        </Seccion>

        <Seccion id="novedades" titulo="Novedades" vacia={datos.novedades.length === 0}>
          <div className="lista-tarjetas">
            {datos.novedades.map((n) => (
              <Tarjeta key={n.id_novedad} titulo={n.titulo} texto={n.contenido} imagen={n.imagen_url} />
            ))}
          </div>
        </Seccion>

        <Seccion id="instalaciones" titulo="Instalaciones" vacia={datos.instalaciones.length === 0}>
          <div className="lista-tarjetas">
            {datos.instalaciones.map((i) => (
              <Tarjeta key={i.id_instalacion} titulo={i.nombre} texto={i.descripcion} imagen={i.imagen_url} />
            ))}
          </div>
        </Seccion>

        <Seccion id="sponsors" titulo="Nuestros sponsors" vacia={datos.sponsors.length === 0}>
          {/* Una sola imagen con todos los logos. Los nombres vienen de la API para el texto alternativo */}
          <div className="inicio__sponsors">
            <img
              src="/imagenes/sponsors.jpg"
              alt={`Logos de nuestros sponsors: ${datos.sponsors.map((s) => s.nombre).join(', ')}`}
            />
          </div>
        </Seccion>
      </>
    );
  }

  return (
    <div className="inicio">
      <section className="inicio__bienvenida">
        <h1>Bienvenidos</h1>
        <p>Deporte, amistad y comunidad en San Cayetano</p>
        {/* Solo sin sesión, como en el prototipo 01 */}
        {!haySesion() && (
          <Link to="/hacete-socio" className="boton boton--primario">Hacete socio</Link>
        )}
      </section>

      <section id="historia" className="inicio__seccion">
        <h2>Nuestra historia</h2>
        <p className="inicio__historia">
          Fundado el 2 de febrero de 1928, Sportivo crece junto a la comunidad hace casi un siglo.
          Campeón de Primera en la Liga Necochense en 1998 y 2016.
        </p>
        <img
          className="inicio__foto"
          src="/imagenes/historia.jpg"
          alt="Hinchas de Sportivo alentando con banderas y paraguas rojos y blancos"
        />
      </section>

      {contenido}
    </div>
  );
}