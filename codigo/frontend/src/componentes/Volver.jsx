import { useNavigate } from 'react-router';
import Icono from './Icono';

// "← Volver" del prototipo.
// Sin "a": vuelve a la pantalla anterior, como el botón atrás del navegador.
// Con "a": va siempre a esa pantalla (por ejemplo, <Volver a="/" />).
export default function Volver({ a }) {
  const navegar = useNavigate();

  function volver() {
    if (a) {
      navegar(a);
    } else {
      navegar(-1);
    }
  }

  return (
    <button type="button" className="volver" onClick={volver}>
      <Icono nombre="arrow_back" />
      Volver
    </button>
  );
}