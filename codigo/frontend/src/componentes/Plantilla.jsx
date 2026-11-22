import { Outlet } from 'react-router';
import Encabezado from './Encabezado';
import Pie from './Pie';

// Marco común de las pantallas.
// Como en el prototipo: el encabezado completo va solo en el Inicio;
// el pie va en Inicio, Buscar y Estado de cuota (los formularios van sin pie).
// La página ocupa al menos el alto de la ventana, así el pie queda siempre abajo.
export default function Plantilla({ conEncabezado = false, conPie = true }) {
  return (
    <div className="pagina">
      {conEncabezado && <Encabezado />}

      {/* Acá se dibuja la pantalla que corresponde a la dirección */}
      <main className="contenedor principal">
        <Outlet />
      </main>

      {conPie && <Pie />}
    </div>
  );
}