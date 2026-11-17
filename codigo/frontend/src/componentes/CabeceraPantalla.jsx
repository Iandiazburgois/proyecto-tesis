import Volver from './Volver';

// Cabecera de las pantallas internas del prototipo: "← Volver", el escudo y el título centrados.
// "volverA" es opcional: si se pasa, Volver va siempre a esa pantalla.
export default function CabeceraPantalla({ titulo, volverA }) {
  return (
    <div className="cabecera-pantalla">
      <Volver a={volverA} />
      <img className="cabecera-pantalla__escudo" src="/escudo.png" alt="Escudo del Club Sportivo San Cayetano" />
      <h1>{titulo}</h1>
    </div>
  );
}
