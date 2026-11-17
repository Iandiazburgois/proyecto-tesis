import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import CabeceraPantalla from '../componentes/CabeceraPantalla';
import { Cargando, ErrorCarga, Vacio } from '../componentes/Estados';
import Icono from '../componentes/Icono';
import Tarjeta from '../componentes/Tarjeta';
import { pedir } from '../servicios/api';
import { cerrarSesion, leerSocio } from '../servicios/sesion';
import './EstadoCuota.css';

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

// Cómo se muestra cada estado de una cuota: siempre ícono + texto, no solo color
const ESTADOS = {
  Pagado: { icono: 'check_circle', clase: 'pagado' },
  'En revisión': { icono: 'schedule', clase: 'revision' },
  Pendiente: { icono: 'warning', clase: 'pendiente' },
};

// "2026-10-10..." → "10/10"
function fechaCorta(fecha) {
  const [, mes, dia] = fecha.slice(0, 10).split('-');
  return `${dia}/${mes}`;
}

// 10000 → "$ 10.000"
function pesos(monto) {
  return `$ ${Number(monto).toLocaleString('es-AR')}`;
}

// R3 — Estado de cuota (05 y 05b del prototipo)
// API: GET /cuotas/mias
export default function EstadoCuota() {
  const navegar = useNavigate();
  const socio = leerSocio();

  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  // Cada vez que cambia, se vuelven a pedir los datos (para el botón Reintentar)
  const [intento, setIntento] = useState(0);

  // Pide las cuotas al abrir la pantalla y cada vez que se reintenta
  useEffect(() => {
    pedir('/cuotas/mias')
      .then((respuesta) => setDatos(respuesta))
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, [intento]);

  function reintentar() {
    setError('');
    setCargando(true);
    setIntento(intento + 1);
  }

  function salir() {
    cerrarSesion();
    navegar('/ingresar');
  }

  // Lo que va debajo de la cabecera, según el estado del pedido
  let contenido;
  if (cargando) {
    contenido = <Cargando texto="Cargando tus cuotas…" />;
  } else if (error) {
    contenido = <ErrorCarga mensaje={error} alReintentar={reintentar} />;
  } else if (datos.cuotas.length === 0) {
    contenido = (
      <Vacio icono="receipt" titulo="Todavía no tenés cuotas">
        <p>Cuando el club genere tu primera cuota, la vas a ver acá.</p>
      </Vacio>
    );
  } else {
    // De la más nueva a la más vieja, como en el prototipo
    const cuotas = [...datos.cuotas].reverse();
    contenido = (
      <>
        <div className="estado-cuota__resumen">
          <p>Titular: {socio.nombre} {socio.apellido}</p>
          <p>Cuotas impagas: {datos.cuotas_impagas}</p>
          <p className="estado-cuota__total">Total a pagar: {pesos(datos.total_a_pagar)}</p>
        </div>

        <div className="lista-tarjetas">
          {cuotas.map((cuota) => {
            const estado = ESTADOS[cuota.estado_pago];
            return (
              <Tarjeta
                key={cuota.id_cuota}
                titulo={`${MESES[cuota.mes_periodo - 1]} ${cuota.anio_periodo}`}
                texto={`Vence ${fechaCorta(cuota.fecha_vencimiento)} · ${pesos(cuota.monto)}`}
              >
                <p className={`estado-cuota__estado estado-cuota__estado--${estado.clase}`}>
                  <Icono nombre={estado.icono} tamano={20} />
                  {cuota.estado_pago}
                </p>
                {/* Solo las pendientes pueden mandar comprobante */}
                {cuota.estado_pago === 'Pendiente' && (
                  <Link to={`/socios/cuotas/${cuota.id_cuota}/comprobante`} className="boton boton--secundario">
                    Enviar comprobante
                  </Link>
                )}
              </Tarjeta>
            );
          })}
        </div>
      </>
    );
  }

  return (
    <section>
      <CabeceraPantalla titulo="Estado de la cuota y pagos" volverA="/socios" />
      {contenido}
      <div className="estado-cuota__acciones">
        <button type="button" className="boton boton--primario" onClick={salir}>
          Cerrar sesión
        </button>
      </div>
    </section>
  );
}