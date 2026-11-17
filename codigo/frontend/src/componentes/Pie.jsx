import Icono from './Icono';
import './Pie.css';

// Pie del prototipo: contacto y ubicación.
// Son datos fijos del club (no están en la base de datos), por eso van escritos acá.
export default function Pie() {
  return (
    <footer className="pie">
      <div className="pie__contenido contenedor">
        <section>
          <h2>Contacto</h2>
          <ul className="pie__lista">
            <li>
              <Icono nombre="call" />
              <a href="tel:+542983556217">2983 556217</a>
              {' / '}
              <a href="tel:+542983618827">2983 618827</a>
            </li>
            <li>
              <Icono nombre="mail" />
              <a href="mailto:clubsportivosancayetano@hotmail.com">clubsportivosancayetano@hotmail.com</a>
            </li>
            <li>
              <Icono nombre="photo_camera" />
              <a href="https://www.instagram.com/clubsportivosancayetano" target="_blank" rel="noreferrer">
                @clubsportivosancayetano
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2>Ubicación</h2>
          <p className="pie__fila">
            <Icono nombre="location_on" />
            25 de Mayo 148, San Cayetano
          </p>
          {/* Captura del mapa; al tocarla se abre el mapa real de OpenStreetMap */}
          <a
            href="https://www.openstreetmap.org/search?query=25%20de%20Mayo%20148%2C%20San%20Cayetano"
            target="_blank"
            rel="noreferrer"
          >
            <img className="pie__mapa" src="/mapa.png" alt="Mapa con la ubicación del club en 25 de Mayo 148" />
          </a>
          {/* La licencia de OpenStreetMap pide nombrar a sus autores */}
          <p className="pie__atribucion">© colaboradores de OpenStreetMap</p>
        </section>
      </div>
    </footer>
  );
}