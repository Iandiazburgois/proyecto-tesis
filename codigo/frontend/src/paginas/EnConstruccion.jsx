import CabeceraPantalla from '../componentes/CabeceraPantalla';

// Página provisoria: se muestra mientras una pantalla todavía no está programada.
export default function EnConstruccion({ titulo }) {
  return (
    <section>
      <CabeceraPantalla titulo={titulo} />
      <p className="estado">Esta pantalla está en construcción.</p>
    </section>
  );
}