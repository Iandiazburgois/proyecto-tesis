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
            {/* Enlace para abrir la ubicación en Google Maps (por ejemplo, para pedir cómo llegar) */}
            <a href="https://maps.app.goo.gl/rfPyof6srZhJbTab6" target="_blank" rel="noreferrer">
              25 de Mayo 148, San Cayetano
            </a>
          </p>
          {/* Mapa de Google Maps insertado en la página, con el marcador en la sede del club */}
          <iframe
            className="pie__mapa"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3129.275927376402!2d-59.61496062383621!3d-38.342595171847734!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9591e2f8f0356969%3A0x81d45859c374f80!2sSede%20Del%20Club%20Sportivo%20San%20Cayetano!5e0!3m2!1ses!2sar!4v1794947171564!5m2!1ses!2sar"
            title="Mapa con la ubicación de la sede del club en 25 de Mayo 148, San Cayetano"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </section>
      </div>
    </footer>
  );
}