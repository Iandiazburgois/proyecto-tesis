import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import CabeceraPantalla from '../componentes/CabeceraPantalla';
import Campo from '../componentes/Campo';
import Tarjeta from '../componentes/Tarjeta';
import { Cargando, ErrorCarga, Mensaje, Vacio } from '../componentes/Estados';
import { pedir } from '../servicios/api';
import { cerrarSesion } from '../servicios/sesion';
import './AdminComprobantes.css';

// Admin — Comprobantes por revisar (10 del prototipo)
// y cuotas pendientes, para marcar las que se pagaron por WhatsApp
// API: GET /cuotas?estado=En revisión, GET /cuotas?estado=Pendiente y PUT /cuotas/:id

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
  'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

// 10000 → "$10.000"
function pesos(numero) {
  return `$${Number(numero).toLocaleString('es-AR')}`;
}

// "2026-09-12 18:45:00" → "12/09"
function diaYMes(fecha) {
  const [, mes, dia] = fecha.slice(0, 10).split('-');
  return `${dia}/${mes}`;
}

// Por socio (apellido y nombre) y, dentro de cada socio, del mes más viejo al más nuevo
function ordenar(lista) {
  return [...lista].sort((a, b) =>
    a.apellido.localeCompare(b.apellido)
    || a.nombre.localeCompare(b.nombre)
    || a.anio_periodo - b.anio_periodo
    || a.mes_periodo - b.mes_periodo);
}

// Sin tildes y en minúscula, para que "gomez" encuentre a "Gómez"
function normalizar(texto) {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export default function AdminComprobantes() {
  const navegar = useNavigate();
  // Las que mandaron comprobante por enlace
  const [cuotas, setCuotas] = useState([]);
  // Las que todavía no se pagaron (o se pagaron por WhatsApp y falta marcarlas)
  const [pendientes, setPendientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [intento, setIntento] = useState(0);

  // Lo que se escribe en el buscador
  const [busqueda, setBusqueda] = useState('');

  const [aviso, setAviso] = useState(null);
  // Id de la cuota que se está guardando, para desactivar solo sus botones
  const [guardando, setGuardando] = useState(null);

  useEffect(() => {
    async function cargar() {
      try {
        // Las dos listas se piden a la vez
        const [enRevision, sinPagar] = await Promise.all([
          pedir(`/cuotas?estado=${encodeURIComponent('En revisión')}`),
          pedir('/cuotas?estado=Pendiente'),
        ]);
        setCuotas(enRevision);
        setPendientes(ordenar(sinPagar));
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
      // Sale de la lista donde estaba. Si se rechazó, pasa a las pendientes en el lugar que le corresponde
      setCuotas(cuotas.filter((c) => c.id_cuota !== cuota.id_cuota));
      const otrasPendientes = pendientes.filter((c) => c.id_cuota !== cuota.id_cuota);
      setPendientes(estado === 'Pendiente' ? ordenar([...otrasPendientes, cuota]) : otrasPendientes);
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

  // Para las que se pagaron por WhatsApp: como no hay enlace, se confirma antes
  function pagarPorWhatsapp(cuota) {
    const nombre = `${cuota.nombre} ${cuota.apellido}`;
    const periodo = `${MESES[cuota.mes_periodo - 1]} ${cuota.anio_periodo}`;
    if (window.confirm(`¿Recibiste por WhatsApp el comprobante de ${nombre} de ${periodo}?`)) {
      revisar(cuota, 'Pagado');
    }
  }

  function salir() {
    cerrarSesion();
    navegar('/ingresar');
  }

  // Se filtra en el navegador: las dos listas ya están cargadas
  const filtro = normalizar(busqueda.trim());
  const coincide = (c) => normalizar(`${c.nombre} ${c.apellido} ${c.dni ?? ''}`).includes(filtro);
  const cuotasVisibles = cuotas.filter(coincide);
  const pendientesVisibles = pendientes.filter(coincide);

  let contenido;
  if (cargando) {
    contenido = <Cargando texto="Cargando los comprobantes…" />;
  } else if (error) {
    contenido = <ErrorCarga mensaje={error} alReintentar={reintentar} />;
  } else {
    contenido = (
      <>
        <Campo
          id="buscar"
          etiqueta="Buscar socio"
          placeholder="Nombre, apellido o DNI"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        {/* ---------- Comprobantes enviados por enlace ---------- */}
        <section>
          <h2>Por revisar</h2>
          {cuotas.length === 0 ? (
            <Vacio icono="task_alt" titulo="No hay comprobantes por revisar">
              Cuando un socio mande un comprobante, va a aparecer acá.
            </Vacio>
          ) : cuotasVisibles.length === 0 ? (
            <p>Ningún comprobante coincide con la búsqueda.</p>
          ) : (
            <div className="lista-tarjetas">
              {cuotasVisibles.map((c) => (
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
          )}
        </section>

        {/* ---------- Cuotas pendientes: para las que se pagaron por WhatsApp ---------- */}
        <section>
          <h2>Cuotas pendientes</h2>
          <p>Si un socio mandó el comprobante por WhatsApp, marcá su cuota como pagada.</p>
          {pendientes.length === 0 ? (
            <Vacio icono="task_alt" titulo="No hay cuotas pendientes" />
          ) : pendientesVisibles.length === 0 ? (
            <p>Ninguna cuota pendiente coincide con la búsqueda.</p>
          ) : (
            <div className="lista-tarjetas">
              {pendientesVisibles.map((c) => (
                <Tarjeta
                  key={c.id_cuota}
                  titulo={`${c.nombre} ${c.apellido}`}
                  texto={`${MESES[c.mes_periodo - 1]} ${c.anio_periodo} · ${pesos(c.monto)}`}
                >
                  <div className="admin-comprobantes__botones">
                    <button
                      type="button"
                      className="boton boton--secundario"
                      onClick={() => pagarPorWhatsapp(c)}
                      disabled={guardando === c.id_cuota}
                    >
                      Pagada por WhatsApp
                    </button>
                  </div>
                </Tarjeta>
              ))}
            </div>
          )}
        </section>
      </>
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