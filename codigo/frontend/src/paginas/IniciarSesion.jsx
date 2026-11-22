import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import CabeceraPantalla from '../componentes/CabeceraPantalla';
import Campo from '../componentes/Campo';
import { Mensaje } from '../componentes/Estados';
import { pedir } from '../servicios/api';
import { guardarSesion } from '../servicios/sesion';
import { esDni, esEmail } from '../servicios/validaciones';
import './IniciarSesion.css';

// Revisa los datos antes de mandarlos a la API.
// Devuelve un objeto con un mensaje por cada campo que tiene un problema.
function validar(usuario, password) {
  const errores = {};
  const texto = usuario.trim();

  if (texto === '') {
    errores.usuario = 'Ingresá tu email o tu DNI.';
  } else if (texto.includes('@')) {
    // Si tiene @, se trata como email
    if (!esEmail(texto)) {
      errores.usuario = 'Revisá el email: tiene que ser como nombre@correo.com.';
    }
  } else if (!esDni(texto)) {
    // Si no tiene @, se trata como DNI
    errores.usuario = 'El DNI tiene que tener 7 u 8 números, sin puntos.';
  }

  if (password === '') {
    errores.password = 'Ingresá tu contraseña.';
  }

  return errores;
}

// R2 — Iniciar sesión (02, 02b y 02c del prototipo)
// API: POST /auth/login
export default function IniciarSesion() {
  const navegar = useNavigate();
  const ubicacion = useLocation();

  // Formulario controlado: lo que se escribe se guarda en el estado
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  // Mensajes de error de cada campo, por ejemplo { usuario: '...', password: '...' }
  const [errores, setErrores] = useState({});
  // Error que viene de la API (datos incorrectos, servidor apagado...)
  const [errorApi, setErrorApi] = useState('');
  // true mientras se espera la respuesta: el botón queda gris (02c)
  const [enviando, setEnviando] = useState(false);

  async function enviar(e) {
    // Evita que el formulario recargue la página
    e.preventDefault();
    setErrorApi('');

    const nuevosErrores = validar(usuario, password);
    setErrores(nuevosErrores);

    // Si hay errores, se lleva el cursor al primer campo con problema y no se sigue
    const campos = Object.keys(nuevosErrores);
    if (campos.length > 0) {
      document.getElementById(campos[0]).focus();
      return;
    }

    setEnviando(true);
    try {
      const datos = await pedir('/auth/login', 'POST', { usuario: usuario.trim(), password });
      guardarSesion(datos.token, datos.socio);

      // Si venía de una pantalla protegida, vuelve ahí; si no, a su área (o al panel si es admin)
      const destino = ubicacion.state?.desde || (datos.socio.rol === 'admin' ? '/admin' : '/socios');
      // replace: así "atrás" no vuelve al login
      navegar(destino, { replace: true });
    } catch (error) {
      if (error.estado === 401) {
        // 02b: la API no dice cuál de los dos falló, así que se marcan los dos
        setErrores({ usuario: true, password: true });
        setErrorApi('Usuario o contraseña incorrectos.');
      } else {
        // Servidor apagado, error 500, etc.: el mensaje que arma api.js
        setErrorApi(error.message);
      }
      setEnviando(false);
    }
  }

  return (
    <section className="ingresar">
      <CabeceraPantalla titulo="Ingresar" />

      {/* noValidate: usamos nuestros propios mensajes de error en vez de los del navegador */}
      <form noValidate onSubmit={enviar}>
        <Campo
          id="usuario"
          etiqueta="Email o DNI"
          type="text"
          placeholder="nombre@correo.com"
          autoComplete="username"
          value={usuario}
          onChange={(e) => {
            setUsuario(e.target.value);
            // Al corregir el campo, se borra su error
            setErrores({ ...errores, usuario: undefined });
          }}
          error={errores.usuario}
        />

        <Campo
          id="password"
          etiqueta="Contraseña"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrores({ ...errores, password: undefined });
          }}
          error={errores.password}
        />

        {/* Error de la API, debajo de los campos (02b) */}
        {errorApi && <Mensaje tipo="error">{errorApi}</Mensaje>}

        <div className="ingresar__acciones">
          {/* Mientras espera, el botón queda gris y deshabilitado (02c) */}
          <button type="submit" className="boton boton--primario" disabled={enviando}>
            {enviando ? 'Ingresando…' : 'Iniciar sesión'}
          </button>
        </div>
      </form>

      {/* Para quien todavía no tiene cuenta: un enlace de texto, el único botón es "Iniciar sesión" */}
      <p className="ingresar__registro">
        ¿Todavía no sos socio? <Link to="/hacete-socio">Hacete socio</Link>
      </p>
    </section>
  );
}