import { useState } from 'react';
import { useNavigate } from 'react-router';
import CabeceraPantalla from '../componentes/CabeceraPantalla';
import Campo from '../componentes/Campo';
import Icono from '../componentes/Icono';
import { Mensaje } from '../componentes/Estados';
import { pedir } from '../servicios/api';
import './PublicarNovedad.css';

// Admin — Publicar novedad (11b del prototipo)
// API: POST /novedades

// Los mismos largos que en la base de datos
const LARGO_TITULO = 150;
const LARGO_IMAGEN = 255;

const NOVEDAD_VACIA = { titulo: '', contenido: '', imagen_url: '', destacado: false };

// La imagen es opcional, pero si se pone tiene que ser un enlace
function esEnlace(texto) {
  return /^(https?:\/\/|\/)\S+$/.test(texto);
}

function validar(novedad) {
  const errores = {};
  if (!novedad.titulo.trim()) errores.titulo = 'Escribí un título.';
  if (!novedad.contenido.trim()) errores.contenido = 'Escribí el contenido de la novedad.';
  const imagen = novedad.imagen_url.trim();
  if (imagen && !esEnlace(imagen)) {
    errores.imagen_url = 'El enlace tiene que empezar con http://, https:// o /';
  }
  return errores;
}

export default function PublicarNovedad() {
  const navegar = useNavigate();
  const [novedad, setNovedad] = useState(NOVEDAD_VACIA);
  const [errores, setErrores] = useState({});
  const [errorApi, setErrorApi] = useState('');
  const [enviando, setEnviando] = useState(false);

  // Un solo manejador para todos los campos. La casilla usa checked en vez de value
  function cambiar(e) {
    const { name, value, type, checked } = e.target;
    setNovedad({ ...novedad, [name]: type === 'checkbox' ? checked : value });
  }

  async function publicar(e) {
    e.preventDefault();
    setErrorApi('');
    const nuevos = validar(novedad);
    setErrores(nuevos);
    const primero = Object.keys(nuevos)[0];
    if (primero) {
      document.getElementById(primero).focus();
      return;
    }

    setEnviando(true);
    try {
      await pedir('/novedades', 'POST', {
        titulo: novedad.titulo.trim(),
        contenido: novedad.contenido.trim(),
        imagen_url: novedad.imagen_url.trim() || undefined,
        destacado: novedad.destacado,
      });
      // Volvemos a la lista con el aviso
      navegar('/admin/novedades', { state: { mensaje: 'Se publicó la novedad.' } });
    } catch (error) {
      setErrorApi(error.message);
      setEnviando(false);
    }
  }

  return (
    <div className="publicar-novedad">
      <CabeceraPantalla titulo="Publicar novedad" volverA="/admin/novedades" />

      <form className="formulario publicar-novedad__formulario" onSubmit={publicar} noValidate>
        <Campo
          id="titulo"
          etiqueta="Título"
          maxLength={LARGO_TITULO}
          placeholder="Inscripciones abiertas para fútbol infantil"
          value={novedad.titulo}
          onChange={cambiar}
          error={errores.titulo}
        />

        {/* El componente Campo es para una sola línea: el texto largo se arma igual, con las mismas clases */}
        <div className="campo">
          <label htmlFor="contenido">Contenido</label>
          <textarea
            id="contenido"
            name="contenido"
            rows={4}
            className={errores.contenido ? 'campo__input campo__input--error' : 'campo__input'}
            aria-invalid={errores.contenido ? true : undefined}
            aria-describedby={errores.contenido ? 'contenido-error' : undefined}
            placeholder="Desde el lunes 23 se reciben inscripciones en secretaría…"
            value={novedad.contenido}
            onChange={cambiar}
          />
          {errores.contenido && (
            <p id="contenido-error" className="campo__error">
              <Icono nombre="warning" tamano={20} />
              {errores.contenido}
            </p>
          )}
        </div>

        <Campo
          id="imagen_url"
          etiqueta="Enlace a la imagen"
          type="url"
          inputMode="url"
          maxLength={LARGO_IMAGEN}
          placeholder="https://…"
          ayuda="Opcional"
          value={novedad.imagen_url}
          onChange={cambiar}
          error={errores.imagen_url}
        />

        <label className="publicar-novedad__destacado">
          <input
            type="checkbox"
            id="destacado"
            name="destacado"
            checked={novedad.destacado}
            onChange={cambiar}
          />
          Mostrar primero en el inicio
        </label>

        {errorApi && <Mensaje tipo="error">{errorApi}</Mensaje>}

        <button type="submit" className="boton boton--primario publicar-novedad__boton" disabled={enviando}>
          {enviando ? 'Publicando…' : 'Publicar'}
        </button>
      </form>
    </div>
  );
}