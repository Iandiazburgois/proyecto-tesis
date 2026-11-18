import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import CabeceraPantalla from '../componentes/CabeceraPantalla';
import Campo from '../componentes/Campo';
import Tarjeta from '../componentes/Tarjeta';
import Icono from '../componentes/Icono';
import { Cargando, ErrorCarga, Mensaje } from '../componentes/Estados';
import { pedir } from '../servicios/api';
import { guardarSesion } from '../servicios/sesion';
import { esEmail } from '../servicios/validaciones';
import './MisDatos.css';

// R3 — Mis datos (08 y 08c del prototipo)
// API: GET y PUT /socios/me, PUT /socios/me/password, POST /socios/me/baja,
//      GET y DELETE /grupo-familia

const LARGO_MINIMO_PASSWORD = 6;

// "1997-07-18" → "18/07/1997"
function fechaCorta(fecha) {
  const [anio, mes, dia] = fecha.slice(0, 10).split('-');
  return `${dia}/${mes}/${anio}`;
}

// Pone el foco en el primer campo con error. Devuelve true si había alguno
function enfocarPrimero(errores) {
  const primero = Object.keys(errores)[0];
  if (primero) document.getElementById(primero).focus();
  return Boolean(primero);
}

// Datos personales y de ingreso
function DatosPersonales({ socio }) {
  const [datos, setDatos] = useState({
    nombre: socio.nombre,
    apellido: socio.apellido,
    telefono: socio.telefono ?? '',
    email: socio.email,
  });
  const [errores, setErrores] = useState({});
  const [aviso, setAviso] = useState(null);
  const [guardando, setGuardando] = useState(false);

  function cambiar(e) {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  }

  function validar() {
    const errores = {};
    if (!datos.nombre.trim()) errores.nombre = 'Ingresá tu nombre.';
    if (!datos.apellido.trim()) errores.apellido = 'Ingresá tu apellido.';
    if (!datos.telefono.trim()) errores.telefono = 'Ingresá tu teléfono.';
    if (!datos.email.trim()) errores.email = 'Ingresá tu email.';
    else if (!esEmail(datos.email.trim())) errores.email = 'El email no es válido.';
    return errores;
  }

  async function guardar(e) {
    e.preventDefault();
    setAviso(null);
    const nuevos = validar();
    setErrores(nuevos);
    if (enfocarPrimero(nuevos)) return;

    setGuardando(true);
    try {
      const actualizado = await pedir('/socios/me', 'PUT', {
        nombre: datos.nombre.trim(),
        apellido: datos.apellido.trim(),
        telefono: datos.telefono.trim(),
        email: datos.email.trim(),
      });
      // Actualizamos la sesión, así el encabezado y el área de socios muestran el nombre nuevo
      guardarSesion(localStorage.getItem('token'), actualizado);
      setAviso({ tipo: 'exito', texto: 'Guardamos tus cambios.' });
    } catch (error) {
      if (error.estado === 409) {
        // Ese email ya lo usa otro socio
        setErrores({ email: error.message });
        document.getElementById('email').focus();
      } else {
        setAviso({ tipo: 'error', texto: error.message });
      }
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form className="mis-datos__bloque" onSubmit={guardar} noValidate>
      <h2>Datos personales del titular</h2>
      <Campo id="nombre" etiqueta="Nombre" maxLength={100} value={datos.nombre} onChange={cambiar} error={errores.nombre} />
      <Campo id="apellido" etiqueta="Apellido" maxLength={100} value={datos.apellido} onChange={cambiar} error={errores.apellido} />
      {/* El DNI y la fecha de nacimiento no se pueden cambiar */}
      <Campo id="dni" etiqueta="DNI" value={socio.dni} disabled readOnly />
      <Campo id="fecha_nacimiento" etiqueta="Fecha de nacimiento" value={fechaCorta(socio.fecha_nacimiento)} disabled readOnly />
      <Campo id="telefono" etiqueta="Teléfono" type="tel" maxLength={30} value={datos.telefono} onChange={cambiar} error={errores.telefono} />

      <h2>Datos de ingreso</h2>
      <Campo id="email" etiqueta="Email" type="email" maxLength={150} value={datos.email} onChange={cambiar} error={errores.email} />

      {aviso && <Mensaje tipo={aviso.tipo}>{aviso.texto}</Mensaje>}
      <button type="submit" className="boton boton--primario mis-datos__boton" disabled={guardando}>
        {guardando ? 'Guardando…' : 'Guardar cambios'}
      </button>
    </form>
  );
}

// Cambiar contraseña
function CambiarPassword() {
  const [claves, setClaves] = useState({ actual: '', nueva: '' });
  const [errores, setErrores] = useState({});
  const [aviso, setAviso] = useState(null);
  const [enviando, setEnviando] = useState(false);

  function cambiar(e) {
    setClaves({ ...claves, [e.target.name]: e.target.value });
  }

  function validar() {
    const errores = {};
    if (!claves.actual) errores.actual = 'Ingresá tu contraseña actual.';
    if (!claves.nueva) errores.nueva = 'Ingresá la nueva contraseña.';
    else if (claves.nueva.length < LARGO_MINIMO_PASSWORD) {
      errores.nueva = `La nueva contraseña tiene que tener al menos ${LARGO_MINIMO_PASSWORD} caracteres.`;
    }
    return errores;
  }

  async function cambiarPassword(e) {
    e.preventDefault();
    setAviso(null);
    const nuevos = validar();
    setErrores(nuevos);
    if (enfocarPrimero(nuevos)) return;

    setEnviando(true);
    try {
      await pedir('/socios/me/password', 'PUT', claves);
      setClaves({ actual: '', nueva: '' });
      setAviso({ tipo: 'exito', texto: 'Cambiaste tu contraseña.' });
    } catch (error) {
      // Si la actual no coincide, la API responde 400 con el mensaje
      setAviso({ tipo: 'error', texto: error.message });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="mis-datos__bloque" onSubmit={cambiarPassword} noValidate>
      <h2>Cambiar contraseña</h2>
      <Campo
        id="actual"
        etiqueta="Contraseña actual"
        type="password"
        autoComplete="current-password"
        value={claves.actual}
        onChange={cambiar}
        error={errores.actual}
      />
      <Campo
        id="nueva"
        etiqueta="Nueva contraseña"
        type="password"
        autoComplete="new-password"
        ayuda={`Mínimo ${LARGO_MINIMO_PASSWORD} caracteres.`}
        value={claves.nueva}
        onChange={cambiar}
        error={errores.nueva}
      />
      {aviso && <Mensaje tipo={aviso.tipo}>{aviso.texto}</Mensaje>}
      <button type="submit" className="boton boton--secundario mis-datos__boton" disabled={enviando}>
        {enviando ? 'Cambiando…' : 'Cambiar contraseña'}
      </button>
    </form>
  );
}

// Grupo familiar
function GrupoFamiliar({ familiares, setFamiliares, mensajeInicial }) {
  const [quitando, setQuitando] = useState(null);
  // Si venimos de agregar un familiar, mostramos ese aviso
  const [aviso, setAviso] = useState(mensajeInicial ? { tipo: 'exito', texto: mensajeInicial } : null);

  async function quitar(familiar) {
    if (!window.confirm(`¿Seguro que querés quitar a ${familiar.nombre} ${familiar.apellido} de tu grupo familiar?`)) return;
    setQuitando(familiar.id_grupo);
    setAviso(null);
    try {
      await pedir(`/grupo-familia/${familiar.id_grupo}`, 'DELETE');
      setFamiliares(familiares.filter((f) => f.id_grupo !== familiar.id_grupo));
      setAviso({ tipo: 'exito', texto: 'Quitamos al familiar. El cambio se ve en tu próxima cuota.' });
    } catch (error) {
      setAviso({ tipo: 'error', texto: error.message });
    } finally {
      setQuitando(null);
    }
  }

  return (
    <section className="mis-datos__bloque">
      <h2>Grupo familiar</h2>
      {familiares.length === 0 ? (
        <p>No tenés familiares cargados.</p>
      ) : (
        <div className="lista-tarjetas mis-datos__familiares">
          {familiares.map((f) => (
            <Tarjeta key={f.id_grupo} titulo={`${f.nombre} ${f.apellido}`} texto={`${f.parentesco} · DNI ${f.dni}`}>
              <button
                type="button"
                className="boton boton--secundario mis-datos__quitar"
                onClick={() => quitar(f)}
                disabled={quitando === f.id_grupo}
              >
                {quitando === f.id_grupo ? 'Quitando…' : 'Quitar'}
              </button>
            </Tarjeta>
          ))}
        </div>
      )}
      {aviso && <Mensaje tipo={aviso.tipo}>{aviso.texto}</Mensaje>}
      <Link to="/socios/datos/familiar" className="mis-datos__agregar">
        <Icono nombre="add" />
        Agregar familiar
      </Link>
    </section>
  );
}

// Pedir la baja
function PedirBaja({ estadoInicial }) {
  const [estado, setEstado] = useState(estadoInicial);
  const [aviso, setAviso] = useState(null);
  const [enviando, setEnviando] = useState(false);

  async function pedirBaja() {
    if (!window.confirm('¿Seguro que querés pedir la baja del club? El club se va a comunicar con vos para terminar el trámite.')) return;
    setEnviando(true);
    setAviso(null);
    try {
      const actualizado = await pedir('/socios/me/baja', 'POST');
      setEstado(actualizado.estado);
    } catch (error) {
      setAviso({ tipo: 'error', texto: error.message });
    } finally {
      setEnviando(false);
    }
  }

  if (estado === 'Baja solicitada') {
    return (
      <div className="mis-datos__bloque mis-datos__baja">
        <Mensaje tipo="exito">Ya pediste la baja. El club se va a comunicar con vos.</Mensaje>
      </div>
    );
  }

  return (
    <div className="mis-datos__bloque mis-datos__baja">
      {aviso && <Mensaje tipo={aviso.tipo}>{aviso.texto}</Mensaje>}
      <button type="button" className="boton boton--secundario" onClick={pedirBaja} disabled={enviando}>
        {enviando ? 'Enviando…' : 'Pedir la baja'}
      </button>
    </div>
  );
}

export default function MisDatos() {
  const ubicacion = useLocation();
  const [socio, setSocio] = useState(null);
  const [familiares, setFamiliares] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    async function cargar() {
      try {
        // Los datos del socio y su familia se piden a la vez
        const [datos, familia] = await Promise.all([pedir('/socios/me'), pedir('/grupo-familia')]);
        setSocio(datos);
        setFamiliares(familia);
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

  let contenido;
  if (cargando) {
    contenido = <Cargando texto="Cargando tus datos…" />;
  } else if (error) {
    contenido = <ErrorCarga mensaje={error} alReintentar={reintentar} />;
  } else {
    contenido = (
      <>
        <DatosPersonales socio={socio} />
        <CambiarPassword />
        <GrupoFamiliar familiares={familiares} setFamiliares={setFamiliares} mensajeInicial={ubicacion.state?.mensaje} />
        <PedirBaja estadoInicial={socio.estado} />
      </>
    );
  }

  return (
    <div className="mis-datos">
      <CabeceraPantalla titulo="Mis datos" volverA="/socios" />
      {contenido}
    </div>
  );
}