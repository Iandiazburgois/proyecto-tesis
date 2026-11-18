import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import CabeceraPantalla from '../componentes/CabeceraPantalla';
import Campo from '../componentes/Campo';
import Tarjeta from '../componentes/Tarjeta';
import { Cargando, ErrorCarga, Vacio } from '../componentes/Estados';
import { pedir } from '../servicios/api';
import './Buscar.css';

// R4 — Buscador (06, 06b y 06c del prototipo)
// API: GET /buscar?q=

// La API acepta hasta 100 caracteres
const LARGO_MAXIMO = 100;

// "2026-10-01 10:00:00" → "01/10/2026"
function fechaCorta(fecha) {
  const [anio, mes, dia] = fecha.slice(0, 10).split('-');
  return `${dia}/${mes}/${anio}`;
}

// "20:00:00" → "20:00"
function hora(texto) {
  return texto.slice(0, 5);
}

// "Lunes y miércoles · 20:00 a 21:30", o la descripción si no tiene días
function horario(actividad) {
  if (!actividad.dias) return actividad.descripcion;
  if (!actividad.hora_inicio || !actividad.hora_fin) return actividad.dias;
  return `${actividad.dias} · ${hora(actividad.hora_inicio)} a ${hora(actividad.hora_fin)}`;
}

export default function Buscar() {
  // Lo que se busca va en la dirección: /buscar?q=futbol
  const [parametros, setParametros] = useSearchParams();
  const q = parametros.get('q') ?? '';

  // Formulario
  const [texto, setTexto] = useState(q);
  const [errorTexto, setErrorTexto] = useState('');

  // Resultados
  const [resultados, setResultados] = useState(null);
  const [cargando, setCargando] = useState(Boolean(q));
  const [error, setError] = useState('');
  const [intento, setIntento] = useState(0);

  // Cada vez que cambia lo que se busca, se le pregunta a la API
  useEffect(() => {
    if (!q) return;
    async function cargar() {
      setCargando(true);
      setError('');
      try {
        setResultados(await pedir(`/buscar?q=${encodeURIComponent(q)}`));
      } catch (e) {
        setError(e.message);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, [q, intento]);

  function buscar(e) {
    e.preventDefault();
    const limpio = texto.trim();
    if (!limpio) {
      setErrorTexto('Escribí qué querés buscar.');
      document.getElementById('q').focus();
      return;
    }
    setErrorTexto('');
    setParametros({ q: limpio });
  }

  let contenido = null;
  if (!q) {
    contenido = null; // todavía no buscó nada: solo se ve el formulario
  } else if (cargando) {
    contenido = <Cargando texto="Buscando…" />;
  } else if (error) {
    contenido = <ErrorCarga mensaje={error} alReintentar={() => setIntento(intento + 1)} />;
  } else if (resultados && resultados.total === 0) {
    contenido = (
      <>
        <Vacio icono="search_off" titulo="Búsqueda sin resultados">
          Probá con otra palabra, por ejemplo “fútbol” o “sede”.
        </Vacio>
        <div className="buscar__acciones">
          <Link to="/" className="boton boton--primario">Volver al inicio</Link>
        </div>
      </>
    );
  } else if (resultados) {
    contenido = (
      <>
        {resultados.novedades.length > 0 && (
          <section className="buscar__grupo">
            <h2>Novedades</h2>
            <div className="lista-tarjetas">
              {resultados.novedades.map((n) => (
                <Tarjeta
                  key={n.id_novedad}
                  icono="schedule"
                  titulo={n.titulo}
                  texto={`${fechaCorta(n.fecha_publicacion)} · ${n.contenido}`}
                />
              ))}
            </div>
          </section>
        )}

        {resultados.actividades.length > 0 && (
          <section className="buscar__grupo">
            <h2>Actividades</h2>
            <div className="lista-tarjetas">
              {resultados.actividades.map((a) => (
                <Tarjeta key={a.id_actividad} icono="directions_run" titulo={a.nombre} texto={horario(a)} />
              ))}
            </div>
          </section>
        )}

        {resultados.instalaciones.length > 0 && (
          <section className="buscar__grupo">
            <h2>Instalaciones</h2>
            <div className="lista-tarjetas">
              {resultados.instalaciones.map((i) => (
                <Tarjeta key={i.id_instalacion} icono="location_on" titulo={i.nombre} texto={i.descripcion} />
              ))}
            </div>
          </section>
        )}
      </>
    );
  }

  return (
    <div className="buscar">
      <CabeceraPantalla titulo={q ? 'Resultados' : 'Buscar'} volverA="/" />

      <form className="buscar__formulario" role="search" onSubmit={buscar} noValidate>
        <Campo
          id="q"
          etiqueta="¿Qué querés buscar?"
          type="search"
          placeholder="Por ejemplo: fútbol"
          maxLength={LARGO_MAXIMO}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          error={errorTexto}
        />
        <button type="submit" className="boton boton--primario">Buscar</button>
      </form>

      {q && <p className="buscar__consulta">Resultados para la búsqueda: “{q}”</p>}

      {contenido}
    </div>
  );
}