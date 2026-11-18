import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import CabeceraPantalla from '../componentes/CabeceraPantalla';
import Tarjeta from '../componentes/Tarjeta';
import { Cargando, ErrorCarga, Mensaje, Vacio } from '../componentes/Estados';
import { pedir } from '../servicios/api';
import { cerrarSesion } from '../servicios/sesion';
import './AdminComprobantes.css';

// Admin — Comprobantes por revisar (10 del prototipo)
// API: GET /cuotas?estado=En revisión y PUT /cuotas/:id

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
  'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

// 10000 → "$10.000"
function pesos(numero) {
  return `$${numero.toLocaleString('es-AR')}`;
}

// "2026-09-12 18:45:00" → "12/09"
function diaYMes(fecha) {
  const [, mes, dia] = fecha.slice(0, 10).split('-');
  return `${dia}/${mes}`;
}

export default function AdminComprobantes() {
  const navegar = useNavigate();
  const [cuotas, setCuotas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [intento, setIntento] = useState(0);

  const [aviso, setAviso] = useState(null);
  // Id de la cuota que se está guardando, para desactivar solo sus botones
  const [guardando, setGuardando] = useState(null);

  useEffect(() => {
    async function cargar() {
      try {
        setCuotas(await pedir(`/cuotas?estado=${encodeURIComponent('En revisión')}`));
      } catch (e) {
        setError(e.message);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, [intento]);

  function reintentar() {
    setError('');
    setCargando(true);
    setIntento(intento + 1);
  }

  // Aprobar (Pagado) o rechazar (vuelve a Pendiente)
  async function revisar(cuota, estado) {
    const nombre = `${cuota.nombre} ${cuota.apellido}`;
    if (estado === 'Pendiente'
      && !window.confirm(`¿Seguro que querés rechazar el comprobante de ${nombre}? La cuota vuelve a quedar pendiente.`)) {
      return;
    }
    setGuardando(cuota.id_cuota);
    setAviso(null);
    try {
      await pedir(`/cuotas/${cuota.id_cuota}`, 'PUT', { estado_pago: estado });
      // Ya no está en revisión: la sacamos de la lista
      setCuotas(cuotas.filter((c) => c.id_cuota !== cuota.id_cuota));
      setAviso({
        tipo: 'exito',
        texto: estado === 'Pagado'
          ? `Marcaste como pagada la cuota de ${nombre}.`
          : `Rechazaste el comprobante de ${nombre}. Puede mandar otro.`,
      });
    } catch (e) {
      setAviso({ tipo: 'error', texto: e.message });
    } finally {
      setGuardando(null);
    }
  }

  function salir() {
    cerrarSesion();
    navegar('/ingresar');
  }

  let contenido;
  if (cargando) {
    contenido = <Cargando texto="Cargando los comprobantes…" />;
  } else if (error) {
    contenido = <ErrorCarga mensaje={error} alReintentar={reintentar} />;
  } else if (cuotas.length === 0) {
    contenido = (
      <Vacio icono="task_alt" titulo="No hay comprobantes por revisar">
        Cuando un socio mande un comprobante, va a aparecer acá.
      </Vacio>
    );
  } else {
    contenido = (
      <div className="lista-tarjetas">
        {cuotas.map((c) => (
          <Tarjeta
            key={c.id_cuota}
            titulo={`${c.nombre} ${c.apellido}`}
            texto={`${MESES[c.mes_periodo - 1]} ${c.anio_periodo} · ${pesos(c.monto)}`}
          >
            <p className="tarjeta__texto">
              {c.medio_pago}
              {c.fecha_pago && ` · enviado el ${diaYMes(c.fecha_pago)}`}
            </p>
            {c.comprobante_url && (
              <a className="admin-comprobantes__ver" href={c.comprobante_url} target="_blank" rel="noreferrer">
                Ver comprobante
              </a>
            )}
            <div className="admin-comprobantes__botones">
              <button
                type="button"
                className="boton boton--primario"
                onClick={() => revisar(c, 'Pagado')}
                disabled={guardando === c.id_cuota}
              >
                Marcar como pagada
              </button>
              <button
                type="button"
                className="boton boton--secundario"
                onClick={() => revisar(c, 'Pendiente')}
                disabled={guardando === c.id_cuota}
              >
                Rechazar
              </button>
            </div>
          </Tarjeta>
        ))}
      </div>
    );
  }

  return (
    <div className="admin-comprobantes">
      <CabeceraPantalla titulo="Comprobantes por revisar" volverA="/admin" />

      {aviso && <Mensaje tipo={aviso.tipo}>{aviso.texto}</Mensaje>}

      {contenido}

      <div className="admin-comprobantes__acciones">
        <button type="button" className="boton boton--primario" onClick={salir}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}