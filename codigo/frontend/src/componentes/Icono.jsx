// Ícono de Material Symbols (guía 5.4).
// aria-hidden: el lector de pantalla no lo lee, porque al lado siempre hay un texto que dice lo mismo.
export default function Icono({ nombre, tamano = 24 }) {
  return (
    <span className="icono material-symbols-outlined" style={{ fontSize: tamano }} aria-hidden="true">
      {nombre}
    </span>
  );
}