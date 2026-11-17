import { useState } from 'react';
import { Link } from 'react-router';
import CabeceraPantalla from '../componentes/CabeceraPantalla';
import Campo from '../componentes/Campo';
import { Mensaje } from '../componentes/Estados';
import { pedir } from '../servicios/api';
import { esDni, esEmail } from '../servicios/validaciones';
import './HaceteSocio.css';

// Datos del titular, vacíos al empezar
const TITULAR_VACIO = {
  nombre: '',
  apellido: '',
  dni: '',
  fecha_nacimiento: '',
  telefono: '',
  email: '',
  password: '',
};

// Revisa los datos del titular antes de mandarlos a la API.
// Devuelve un objeto con un mensaje por cada campo que tiene un problema.
function validarTitular(titular) {
  const errores = {};
  const hoy = new Date().toISOString().slice(0, 10); // fecha de hoy en formato AAAA-MM-DD

  if (titular.nombre.trim() === '') errores.nombre = 'Ingresá tu nombre.';
  if (titular.apellido.trim() === '') errores.apellido = 'Ingresá tu apellido.';

  if (!esDni(titular.dni.trim())) {
    errores.dni = 'El DNI tiene que tener 7 u 8 números, sin puntos.';
  }

  if (titular.fecha_nacimiento === '') {
    errores.fecha_nacimiento = 'Ingresá tu fecha de nacimiento.';
  } else if (titular.fecha_nacimiento > hoy) {
    errores.fecha_nacimiento = 'La fecha no puede ser posterior a hoy.';
  }

  // El teléfono es opcional: solo se revisa si se completó
  if (titular.telefono.trim() !== '' && !/^[0-9+\-\s]+$/.test(titular.telefono)) {
    errores.telefono = 'El teléfono solo puede tener números, espacios, + y -.';
  }

  if (titular.email.trim() === '') {
    errores.email = 'Ingresá tu email.';
  } else if (!esEmail(titular.email.trim())) {
    errores.email = 'Revisá el email: tiene que ser como nombre@correo.com.';
  }

  if (titular.password.length < 6) {
    errores.password = 'La contraseña tiene que tener al menos 6 caracteres.';
  }

  return errores;
}

// R2 — Registro (03, 03b y 03c del prototipo)
// API: POST /auth/registro
export default function HaceteSocio() {
  // Un solo objeto con todos los datos del titular
  const [titular, setTitular] = useState(TITULAR_VACIO);
  // Mensajes de error de cada campo
  const [errores, setErrores] = useState({});
  // Error general de la API (servidor apagado, error 500...)
  const [errorApi, setErrorApi] = useState('');
  // true mientras se espera la respuesta: el botón queda gris
  const [enviando, setEnviando] = useState(false);
  // true cuando el registro salió bien: se muestra la pantalla de éxito (03c)
  const [registrado, setRegistrado] = useState(false);

  // Una sola función para todos los campos: usa el "name" del campo para saber cuál cambió
  function cambiar(e) {
    setTitular({ ...titular, [e.target.name]: e.target.value });
    // Al corregir un campo, se borra su error
    setErrores({ ...errores, [e.target.name]: undefined });
  }

  async function enviar(e) {
    // Evita que el formulario recargue la página
    e.preventDefault();
    setErrorApi('');

    const nuevosErrores = validarTitular(titular);
    setErrores(nuevosErrores);

    // Si hay errores, se lleva el cursor al primer campo con problema y no se sigue
    const campos = Object.keys(nuevosErrores);
    if (campos.length > 0) {
      document.getElementById(campos[0]).focus();
      return;
    }

    // Se mandan los datos limpios (sin espacios de más); el teléfono solo si se completó
    const socio = {
      nombre: titular.nombre.trim(),
      apellido: titular.apellido.trim(),
      dni: titular.dni.trim(),
      fecha_nacimiento: titular.fecha_nacimiento,
      telefono: titular.telefono.trim() || undefined,
      email: titular.email.trim(),
      password: titular.password,
    };

    setEnviando(true);
    try {
      await pedir('/auth/registro', 'POST', { socio, familiares: [] });
      setRegistrado(true);
      // Se vuelve arriba para que se vea el mensaje de éxito
      window.scrollTo(0, 0);
    } catch (error) {
      if (error.estado === 409) {
        // El email o el DNI ya están registrados: el mensaje va en el campo que corresponde
        if (error.message.includes('email')) {
          setErrores({ email: 'Ya hay un socio registrado con ese email.' });
          document.getElementById('email').focus();
        } else {
          setErrores({ dni: 'Ya hay un socio registrado con ese DNI.' });
          document.getElementById('dni').focus();
        }
      } else {
        setErrorApi(error.message);
      }
    } finally {
      setEnviando(false);
    }
  }

  // Pantalla de éxito (03c)
  if (registrado) {
    return (
      <section className="hacete-socio">
        <CabeceraPantalla titulo="Inscripción de socios" />
        <div className="hacete-socio__exito">
          <Mensaje tipo="exito">¡Listo! Ya sos socio. Iniciá sesión para entrar.</Mensaje>
          <Link to="/ingresar" className="boton boton--primario">Iniciar sesión</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="hacete-socio">
      <CabeceraPantalla titulo="Inscripción de socios" />

      <form noValidate onSubmit={enviar}>
        <h2>Datos personales del titular</h2>
        <div className="hacete-socio__campos">
          <Campo id="nombre" etiqueta="Nombre" autoComplete="given-name" maxLength={100}
            value={titular.nombre} onChange={cambiar} error={errores.nombre} />
          <Campo id="apellido" etiqueta="Apellido" autoComplete="family-name" maxLength={100}
            value={titular.apellido} onChange={cambiar} error={errores.apellido} />
          <Campo id="dni" etiqueta="DNI" inputMode="numeric" placeholder="Sin puntos" maxLength={8}
            value={titular.dni} onChange={cambiar} error={errores.dni} />
          <Campo id="fecha_nacimiento" etiqueta="Fecha de nacimiento" type="date" autoComplete="bday"
            value={titular.fecha_nacimiento} onChange={cambiar} error={errores.fecha_nacimiento} />
          <Campo id="telefono" etiqueta="Teléfono (opcional)" type="tel" autoComplete="tel" maxLength={30}
            value={titular.telefono} onChange={cambiar} error={errores.telefono} />
        </div>
        <p className="hacete-socio__nota">La foto del DNI se presenta en secretaría al confirmar el alta.</p>

        <h2>Datos de ingreso</h2>
        <div className="hacete-socio__campos">
          <Campo id="email" etiqueta="Email" type="email" placeholder="nombre@correo.com" autoComplete="email"
            maxLength={150} value={titular.email} onChange={cambiar} error={errores.email} />
          <Campo id="password" etiqueta="Contraseña" type="password" autoComplete="new-password"
            ayuda="Mínimo 6 caracteres." value={titular.password} onChange={cambiar} error={errores.password} />
        </div>

        {/* Error de la API (servidor apagado, error 500...) */}
        {errorApi && <Mensaje tipo="error">{errorApi}</Mensaje>}

        <div className="hacete-socio__acciones">
          {/* Mientras espera, el botón queda gris y deshabilitado */}
          <button type="submit" className="boton boton--primario" disabled={enviando}>
            {enviando ? 'Enviando…' : 'Confirmar'}
          </button>
        </div>
      </form>
    </section>
  );
}