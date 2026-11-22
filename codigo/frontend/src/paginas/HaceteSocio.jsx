import { useState } from 'react';
import { Link } from 'react-router';
import CabeceraPantalla from '../componentes/CabeceraPantalla';
import Campo from '../componentes/Campo';
import { Mensaje } from '../componentes/Estados';
import Icono from '../componentes/Icono';
import { pedir } from '../servicios/api';
import { edad, esDni, esEmail } from '../servicios/validaciones';
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

// El titular tiene que ser mayor de edad (igual que en la API)
const EDAD_MINIMA = 18;
// Más de 110 años es casi seguro un error al escribir la fecha
const EDAD_MAXIMA = 110;

// Datos de un familiar, vacíos al agregarlo
const FAMILIAR_VACIO = { nombre: '', apellido: '', dni: '', parentesco: '' };

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

  if (!titular.fecha_nacimiento) {
    errores.fecha_nacimiento = 'Ingresá tu fecha de nacimiento.';
  } else if (titular.fecha_nacimiento > hoy) {
    errores.fecha_nacimiento = 'La fecha no puede ser posterior a hoy.';
  } else if (edad(titular.fecha_nacimiento) > EDAD_MAXIMA) {
    errores.fecha_nacimiento = 'Revisá la fecha de nacimiento.';
  } else if (edad(titular.fecha_nacimiento) < EDAD_MINIMA) {
    errores.fecha_nacimiento = `Para registrarte como titular tenés que tener al menos ${EDAD_MINIMA} años. Si sos menor, pedile a tu mamá, papá o tutor que se registre y te sume como familiar.`;
  }

  // Validar si está vacío o si tiene un formato incorrecto
  if (!titular.telefono.trim()) {
    errores.telefono = 'Ingresá tu teléfono.';
  } else if (!/^[0-9+\-\s]+$/.test(titular.telefono)) {
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

// Un familiar está vacío si no se completó ninguno de sus campos
function estaVacio(familiar) {
  return Object.values(familiar).every((valor) => valor.trim() === '');
}

// Revisa un familiar: si se completó alguno de sus datos, se piden todos
function validarFamiliar(familiar) {
  const errores = {};
  if (estaVacio(familiar)) return errores;

  if (familiar.nombre.trim() === '') errores.nombre = 'Ingresá el nombre.';
  if (familiar.apellido.trim() === '') errores.apellido = 'Ingresá el apellido.';
  if (!esDni(familiar.dni.trim())) errores.dni = 'El DNI tiene que tener 7 u 8 números, sin puntos.';
  if (familiar.parentesco.trim() === '') errores.parentesco = 'Indicá el parentesco.';

  return errores;
}

// R2 — Registro (03, 03b y 03c del prototipo)
// API: POST /auth/registro
export default function HaceteSocio() {
  // Un solo objeto con todos los datos del titular
  const [titular, setTitular] = useState(TITULAR_VACIO);
  // Lista de familiares: arranca con uno en blanco, como en el prototipo
  const [familiares, setFamiliares] = useState([FAMILIAR_VACIO]);
  // Mensajes de error del titular y de cada familiar (una lista, en el mismo orden)
  const [errores, setErrores] = useState({});
  const [erroresFamiliares, setErroresFamiliares] = useState([]);
  // Error general de la API (servidor apagado, error 500...)
  const [errorApi, setErrorApi] = useState('');
  // true mientras se espera la respuesta: el botón queda gris
  const [enviando, setEnviando] = useState(false);
  // true cuando el registro salió bien: se muestra la pantalla de éxito (03c)
  const [registrado, setRegistrado] = useState(false);

  // Una sola función para todos los campos del titular: usa el "name" del campo
  function cambiar(e) {
    setTitular({ ...titular, [e.target.name]: e.target.value });
    // Al corregir un campo, se borra su error
    setErrores({ ...errores, [e.target.name]: undefined });
  }

  // Cambia un dato de un familiar: se arma una lista nueva con ese familiar actualizado
  function cambiarFamiliar(indice, campo, valor) {
    setFamiliares(familiares.map((f, i) => (i === indice ? { ...f, [campo]: valor } : f)));
    setErroresFamiliares(
      erroresFamiliares.map((err, i) => (i === indice ? { ...err, [campo]: undefined } : err))
    );
  }

  function agregarFamiliar() {
    setFamiliares([...familiares, FAMILIAR_VACIO]);
  }

  function quitarFamiliar(indice) {
    setFamiliares(familiares.filter((_, i) => i !== indice));
    setErroresFamiliares(erroresFamiliares.filter((_, i) => i !== indice));
  }

  async function enviar(e) {
    // Evita que el formulario recargue la página
    e.preventDefault();
    setErrorApi('');

    const nuevosErrores = validarTitular(titular);
    const nuevosErroresFamiliares = familiares.map(validarFamiliar);
    setErrores(nuevosErrores);
    setErroresFamiliares(nuevosErroresFamiliares);

    // Si hay errores, se lleva el cursor al primer campo con problema (primero el titular) y no se sigue
    const camposTitular = Object.keys(nuevosErrores);
    if (camposTitular.length > 0) {
      document.getElementById(camposTitular[0]).focus();
      return;
    }
    const conError = nuevosErroresFamiliares.findIndex((err) => Object.keys(err).length > 0);
    if (conError !== -1) {
      const campo = Object.keys(nuevosErroresFamiliares[conError])[0];
      document.getElementById(`familiar-${conError}-${campo}`).focus();
      return;
    }

    // Se mandan los datos limpios (sin espacios de más); el teléfono solo si se completó
    const socio = {
      nombre: titular.nombre.trim(),
      apellido: titular.apellido.trim(),
      dni: titular.dni.trim(),
      fecha_nacimiento: titular.fecha_nacimiento,
      telefono: titular.telefono.trim(),
      email: titular.email.trim(),
      password: titular.password,
    };

    // Solo los familiares que se completaron
    const familiaresCompletos = familiares
      .filter((f) => !estaVacio(f))
      .map((f) => ({
        nombre: f.nombre.trim(),
        apellido: f.apellido.trim(),
        dni: f.dni.trim(),
        parentesco: f.parentesco.trim(),
      }));

    setEnviando(true);
    try {
      await pedir('/auth/registro', 'POST', { socio, familiares: familiaresCompletos });
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
          <Campo id="telefono" etiqueta="Teléfono" type="tel" autoComplete="tel" maxLength={30} 
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

        <h2>Grupo familiar</h2>
        <p className="hacete-socio__nota">La cuota social es de $3.000 por mes por persona, incluidos los menores. El titular paga una sola cuota por todo el grupo. Los menores de 18 se suman acá como familiares.</p>
    
        {/* Un bloque por familiar; el id lleva el número para que no se repita */}
        {familiares.map((familiar, i) => {
          const err = erroresFamiliares[i] || {};
          return (
            <fieldset key={i} className="hacete-socio__familiar">
              <legend>Familiar {i + 1}</legend>
              <div className="hacete-socio__campos">
                <Campo id={`familiar-${i}-nombre`} etiqueta="Nombre" maxLength={100}
                  value={familiar.nombre} error={err.nombre}
                  onChange={(e) => cambiarFamiliar(i, 'nombre', e.target.value)} />
                <Campo id={`familiar-${i}-apellido`} etiqueta="Apellido" maxLength={100}
                  value={familiar.apellido} error={err.apellido}
                  onChange={(e) => cambiarFamiliar(i, 'apellido', e.target.value)} />
                <Campo id={`familiar-${i}-dni`} etiqueta="DNI" inputMode="numeric" placeholder="Sin puntos" maxLength={8}
                  value={familiar.dni} error={err.dni}
                  onChange={(e) => cambiarFamiliar(i, 'dni', e.target.value)} />
                <Campo id={`familiar-${i}-parentesco`} etiqueta="Parentesco" placeholder="Ej.: hijo, cónyuge" maxLength={50}
                  value={familiar.parentesco} error={err.parentesco}
                  onChange={(e) => cambiarFamiliar(i, 'parentesco', e.target.value)} />
              </div>
              <button type="button" className="boton boton--secundario" onClick={() => quitarFamiliar(i)}>
                Quitar
              </button>
            </fieldset>
          );
        })}

        <button type="button" className="hacete-socio__agregar" onClick={agregarFamiliar}>
          <Icono nombre="add" />
          {familiares.length === 0 ? 'Agregar familiar' : 'Agregar otro familiar'}
        </button>

        {/* Error de la API (servidor apagado, error 500...) */}
        {errorApi && <Mensaje tipo="error">{errorApi}</Mensaje>}

        <div className="hacete-socio__acciones">
          {/* Mientras espera, el botón queda gris y deshabilitado */}
          <button type="submit" className="boton boton--primario" disabled={enviando}>
            {enviando ? 'Enviando…' : 'Confirmar'}
          </button>
        </div>
      </form>

      {/* Para quien ya tiene cuenta: un enlace de texto, el único botón es "Confirmar" */}
      <p className="hacete-socio__ingresar">
        ¿Ya sos socio? <Link to="/ingresar">Iniciá sesión</Link>
      </p>
    </section>
  );
}