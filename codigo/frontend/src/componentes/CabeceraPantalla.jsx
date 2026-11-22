import { Link } from 'react-router';
import Volver from './Volver';

// Cabecera de las pantallas internas del prototipo: "← Volver", el escudo y el título centrados.
// "volverA" es opcional: si se pasa, Volver va siempre a esa pantalla.
export default function CabeceraPantalla({ titulo, volverA }) {
  return (
    <div className="cabecera-pantalla">
      <Volver a={volverA} />
      {/* El escudo lleva al inicio */}
      <Link to="/" className="cabecera-pantalla__inicio">
        <img
          className="cabecera-pantalla__escudo"
          src="/escudo.png"
          alt="Club Sportivo San Cayetano, ir al inicio"
        />
      </Link>
      <h1>{titulo}</h1>
    </div>
  );
}