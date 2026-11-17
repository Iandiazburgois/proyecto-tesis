import { Link } from 'react-router';
import { Vacio } from '../componentes/Estados';

// Se muestra si alguien escribe una dirección que no existe en el sitio
export default function NoEncontrada() {
  return (
    <Vacio icono="explore_off" titulo="Esta página no existe">
      <p>Puede que el enlace esté mal escrito o que la página se haya movido.</p>
      <Link to="/" className="boton boton--primario">Volver al inicio</Link>
    </Vacio>
  );
}