import { Link } from 'react-router';
import Icono from './Icono';

// Tarjeta de la guía (5.5). Según lo que recibe:
//   "a"  → enlace a otra pantalla del sitio
//   "href" → enlace a otra página (se abre en otra pestaña)
//   ninguno → solo muestra información
// "children" es lo que se pone adentro, por ejemplo un botón.
export default function Tarjeta({ titulo, texto, icono, imagen, a, href, children }) {
  // El contenido es igual en las tres formas
  const contenido = (
    <>
      {imagen && <img className="tarjeta__imagen" src={imagen} alt="" />}
      <div className="tarjeta__cuerpo">
        {icono && <span className="tarjeta__icono"><Icono nombre={icono} /></span>}
        <div>
          <h3 className="tarjeta__titulo">{titulo}</h3>
          {texto && <p className="tarjeta__texto">{texto}</p>}
          {children}
        </div>
      </div>
    </>
  );

  // Enlace dentro del sitio: Link, para no recargar la página (clase 29)
  if (a) {
    return <Link to={a} className="tarjeta">{contenido}</Link>;
  }

  // Enlace a otra página: se abre en otra pestaña
  if (href) {
    return (
      <a href={href} className="tarjeta" target="_blank" rel="noreferrer">
        {contenido}
      </a>
    );
  }

  // Solo información
  return <article className="tarjeta">{contenido}</article>;
}