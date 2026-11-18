import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import CabeceraPantalla from '../componentes/CabeceraPantalla';
import Campo from '../componentes/Campo';
import { Cargando, ErrorCarga, Mensaje, Vacio } from '../componentes/Estados';
import { pedir } from '../servicios/api';
import './EnviarComprobante.css';

// R3 — Enviar comprobante (05c del prototipo)
// API: GET /cuotas/mias y PUT /cuotas/:id/comprobante

// Datos para pagar por transferencia
const ALIAS_PAGO = 'sportivo.sc';
const MEDIO_PAGO = 'Transferencia';

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

// El enlace tiene que estar y empezar con http:// o https://
function validarEnlace(texto) {
  if (!texto.trim()) return 'Pegá el enlace del comprobante.';
  if (!/^https?:\/\/\S+$/.test(texto.trim())) return 'El enlace tiene que empezar con http:// o https://';
  return '';
}

export default function EnviarComprobante() {
  const { id } = useParams();

  // Carga de la cuota
  const [cuota, setCuota] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [intento, setIntento] = useState(0);

  // Formulario
  const [enlace, setEnlace] = useState('');
  const [errorEnlace, setErrorEnlace] = useState('');
  const [errorApi, setErrorApi] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  // Busca la cuota entre las del socio
  useEffect(() => {
    async function cargar() {
      try {
        const datos = await pedir('/cuotas/mias');
        setCuota(datos.cuotas.find((c) => c.id_cuota === Number(id)) ?? null);
      } catch (e) {
        setError(e.message);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, [id, intento]);

  function reintentar() {
    setError('');
    setCargando(true);
    setIntento(intento + 1);
  }

  async function enviar(e) {
    e.preventDefault();
    setErrorApi('');
    const mensaje = validarEnlace(enlace);
    setErrorEnlace(mensaje);
    if (mensaje) {
      document.getElementById('enlace').focus();
      return;
    }

    setEnviando(true);
    try {
      await pedir(`/cuotas/${id}/comprobante`, 'PUT', {
        comprobante_url: enlace.trim(),
        medio_pago: MEDIO_PAGO,
      });
      setEnviado(true);
    } catch (error) {
      setErrorApi(error.message);
    } finally {
      setEnviando(false);
    }
  }

  let contenido;
  if (cargando) {
    contenido = <Cargando texto="Cargando la cuota…" />;
  } else if (error) {
    contenido = <ErrorCarga mensaje={error} alReintentar={reintentar} />;
  } else if (!cuota) {
    contenido = (
      <Vacio icono="search_off" titulo="No encontramos esa cuota">
        <Link to="/socios/cuotas">Volver a mis cuotas</Link>
      </Vacio>
    );
  } else if (enviado) {
    contenido = (
      <div className="enviar-comprobante__final">
        <Mensaje tipo="exito">
          ¡Listo! Recibimos tu comprobante. La cuota queda en revisión hasta que el club lo confirme.
        </Mensaje>
        <Link to="/socios/cuotas" className="boton boton--primario">Volver a mis cuotas</Link>
      </div>
    );
  } else if (cuota.estado_pago !== 'Pendiente') {
    // Ya mandó comprobante o ya está pagada: no se vuelve a enviar
    contenido = (
      <Vacio icono="task_alt" titulo={`Esta cuota está ${cuota.estado_pago.toLowerCase()}`}>
        <Link to="/socios/cuotas">Volver a mis cuotas</Link>
      </Vacio>
    );
  } else {
    contenido = (
      <>
        <article className="tarjeta">
          <div className="tarjeta__cuerpo">
            <h2 className="tarjeta__titulo">
              {MESES[cuota.mes_periodo - 1]} {cuota.anio_periodo}
            </h2>
            <p className="tarjeta__texto">
              Vence {fechaCorta(cuota.fecha_vencimiento)} · {pesos(cuota.monto)}
            </p>
            <p className="enviar-comprobante__estado">Pendiente</p>
          </div>
        </article>

        <div>
          <p><strong>Medio de pago:</strong> transferencia</p>
          <p><strong>Alias:</strong> {ALIAS_PAGO}</p>
        </div>

        <form className="formulario" onSubmit={enviar} noValidate>
          <Campo
            id="enlace"
            etiqueta="Enlace al comprobante"
            type="url"
            inputMode="url"
            placeholder="https://…"
            value={enlace}
            onChange={(e) => setEnlace(e.target.value)}
            error={errorEnlace}
            ayuda="Subí el comprobante a Google Drive y pegá acá el enlace para compartirlo."
          />
          {/* Pasos para conseguir el enlace: el banco y Mercado Pago dan un PDF, no un link */}
          <details className="enviar-comprobante__ayuda">
            <summary>¿Cómo consigo el enlace?</summary>
            <ol>
              <li>En Mercado Pago o en tu banco, descargá el comprobante de la transferencia.</li>
              <li>Abrí Google Drive y subí ese archivo.</li>
              <li>En el archivo, tocá Compartir y elegí “Cualquier persona con el enlace”.</li>
              <li>Tocá Copiar vínculo y pegalo arriba.</li>
            </ol>
          </details>
          {errorApi && <Mensaje tipo="error">{errorApi}</Mensaje>}
          <button type="submit" className="boton boton--primario enviar-comprobante__boton" disabled={enviando}>
            {enviando ? 'Enviando…' : 'Enviar'}
          </button>
        </form>
      </>
    );
  }

  return (
    <div className="enviar-comprobante">
      <CabeceraPantalla titulo="Enviar comprobante" volverA="/socios/cuotas" />
      {contenido}
    </div>
  );
}