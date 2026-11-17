import { useNavigate } from 'react-router';
import CabeceraPantalla from '../componentes/CabeceraPantalla';
import Tarjeta from '../componentes/Tarjeta';
import { cerrarSesion, leerSocio } from '../servicios/sesion';
import './AreaSocios.css';

// WhatsApp del club para las reservas (código de país 54, 9 de celular y el número sin 0 ni 15)
const WHATSAPP_RESERVAS = 'https://wa.me/5492983556217';

// R3 — Área de socios (04 del prototipo)
// API: no pide datos, usa los del socio que inició sesión
export default function AreaSocios() {
  const navegar = useNavigate();
  const socio = leerSocio();

  function salir() {
    cerrarSesion();
    // Como en el prototipo: al cerrar sesión vuelve a Iniciar sesión
    navegar('/ingresar');
  }

  return (
    <section>
      {/* El Volver va al Inicio: hacia atrás estaría el login */}
      <CabeceraPantalla titulo={`Hola, ${socio.nombre}`} volverA="/" />

      <div className="lista-tarjetas">
        <Tarjeta
          icono="receipt"
          titulo="Estado de cuota"
          texto="Mirá tus cuotas y enviá comprobantes"
          a="/socios/cuotas"
        />
        <Tarjeta
          icono="person"
          titulo="Datos personales"
          texto="Tus datos y tu grupo familiar"
          a="/socios/datos"
        />
        <Tarjeta
          icono="chat"
          titulo="Reservas de instalaciones"
          texto="Consultá por WhatsApp"
          href={WHATSAPP_RESERVAS}
        />
      </div>

      <div className="area-socios__acciones">
        <button type="button" className="boton boton--primario" onClick={salir}>
          Cerrar sesión
        </button>
      </div>
    </section>
  );
}