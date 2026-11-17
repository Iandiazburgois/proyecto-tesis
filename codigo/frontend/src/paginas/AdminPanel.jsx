import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import CabeceraPantalla from '../componentes/CabeceraPantalla';
import Tarjeta from '../componentes/Tarjeta';
import { Mensaje } from '../componentes/Estados';
import { pedir } from '../servicios/api';
import { cerrarSesion } from '../servicios/sesion';
import './AdminPanel.css';

// Panel de administración (09 del prototipo)
// API: GET /cuotas?estado=En revisión y POST /cuotas/emitir

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
  'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

// Texto de la tarjeta de comprobantes según cuántos haya
function textoComprobantes(cantidad) {
  if (cantidad === 0) return 'No hay comprobantes para revisar';
  if (cantidad === 1) return '1 pendiente de revisión';
  return `${cantidad} pendientes de revisión`;
}

export default function AdminPanel() {
  const navegar = useNavigate();

  // Cantidad de comprobantes por revisar
  const [pendientes, setPendientes] = useState(null);
  const [errorPendientes, setErrorPendientes] = useState(false);

  useEffect(() => {
    async function cargar() {
      try {
        const cuotas = await pedir(`/cuotas?estado=${encodeURIComponent('En revisión')}`);
        setPendientes(cuotas.length);
      } catch {
        setErrorPendientes(true);
      }
    }
    cargar();
  }, []);

  let textoPendientes = 'Cargando…';
  if (errorPendientes) textoPendientes = 'No se pudo cargar la cantidad';
  else if (pendientes !== null) textoPendientes = textoComprobantes(pendientes);

  // Emisión de las cuotas del mes actual
  const hoy = new Date();
  const mes = hoy.getMonth() + 1; // getMonth() va de 0 a 11
  const anio = hoy.getFullYear();
  const [emitiendo, setEmitiendo] = useState(false);
  const [resultado, setResultado] = useState(null);

  async function emitirCuotas() {
    setEmitiendo(true);
    setResultado(null);
    try {
      const r = await pedir('/cuotas/emitir', 'POST', { mes, anio });
      const texto = r.emitidas > 0
        ? `Se emitieron ${r.emitidas} cuotas de ${MESES[mes - 1]} ${anio}.`
        : `Todos los socios activos ya tenían la cuota de ${MESES[mes - 1]} ${anio}.`;
      setResultado({ tipo: 'exito', texto });
    } catch (error) {
      setResultado({ tipo: 'error', texto: error.message });
    } finally {
      setEmitiendo(false);
    }
  }

  function salir() {
    cerrarSesion();
    navegar('/ingresar');
  }

  return (
    <>
      <CabeceraPantalla titulo="Panel de administración" volverA="/" />

      <div className="lista-tarjetas">
        <Tarjeta titulo="Comprobantes por revisar" texto={textoPendientes} a="/admin/comprobantes" />
        <Tarjeta titulo="Novedades" texto="Publicá y borrá novedades del club" a="/admin/novedades" />
        <Tarjeta titulo="Socios" texto="Ver información" a="/admin/socios" />
      </div>

      {/* Agregado al prototipo: emitir las cuotas del mes */}
      <section className="tarjeta admin-panel__cuotas">
        <h2 className="tarjeta__titulo">Cuotas del mes</h2>
        <p className="tarjeta__texto">
          Crea la cuota de {MESES[mes - 1]} {anio} para cada socio activo: $3.000 por persona del grupo.
        </p>
        <button type="button" className="boton boton--primario" onClick={emitirCuotas} disabled={emitiendo}>
          {emitiendo ? 'Emitiendo…' : 'Emitir cuotas del mes'}
        </button>
        {resultado && <Mensaje tipo={resultado.tipo}>{resultado.texto}</Mensaje>}
      </section>

      <div className="admin-panel__acciones">
        <button type="button" className="boton boton--primario" onClick={salir}>
          Cerrar sesión
        </button>
      </div>
    </>
  );
}