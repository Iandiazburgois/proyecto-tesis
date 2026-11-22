import { useState } from 'react';
import { useNavigate } from 'react-router';
import CabeceraPantalla from '../componentes/CabeceraPantalla';
import Campo from '../componentes/Campo';
import { Mensaje } from '../componentes/Estados';
import { pedir } from '../servicios/api';
import { esDni } from '../servicios/validaciones';
import { leerSocio } from '../servicios/sesion';
import './AgregarFamiliar.css';

// R3 — Agregar familiar (08b del prototipo)
// API: POST /grupo-familia

const FAMILIAR_VACIO = { nombre: '', apellido: '', dni: '', parentesco: '' };

function validar(familiar) {
  const errores = {};
  if (!familiar.nombre.trim()) errores.nombre = 'Ingresá el nombre.';
  if (!familiar.apellido.trim()) errores.apellido = 'Ingresá el apellido.';
  if (!familiar.dni.trim()) errores.dni = 'Ingresá el DNI.';
  else if (!esDni(familiar.dni.trim())) errores.dni = 'El DNI tiene que tener 7 u 8 números, sin puntos.';
    else if (familiar.dni.trim() === leerSocio()?.dni) errores.dni = 'Ese es tu DNI. Ingresá el DNI de tu familiar.';
  if (!familiar.parentesco.trim()) errores.parentesco = 'Ingresá el parentesco, por ejemplo hijo o cónyuge.';
  return errores;
}

export default function AgregarFamiliar() {
  const navegar = useNavigate();
  const [familiar, setFamiliar] = useState(FAMILIAR_VACIO);
  const [errores, setErrores] = useState({});
  const [errorApi, setErrorApi] = useState('');
  const [enviando, setEnviando] = useState(false);

  function cambiar(e) {
    setFamiliar({ ...familiar, [e.target.name]: e.target.value });
  }

  async function agregar(e) {
    e.preventDefault();
    setErrorApi('');
    const nuevos = validar(familiar);
    setErrores(nuevos);
    const primero = Object.keys(nuevos)[0];
    if (primero) {
      document.getElementById(primero).focus();
      return;
    }

    setEnviando(true);
    try {
      await pedir('/grupo-familia', 'POST', {
        nombre: familiar.nombre.trim(),
        apellido: familiar.apellido.trim(),
        dni: familiar.dni.trim(),
        parentesco: familiar.parentesco.trim(),
      });
      // Volvemos a Mis datos con el aviso
      navegar('/socios/datos', {
        state: { mensaje: 'Agregamos a tu familiar. El cambio se ve en tu próxima cuota.' },
      });
    } catch (error) {
      if (error.estado === 409) {
        // Ese DNI ya está en el grupo familiar
        setErrores({ dni: error.message });
        document.getElementById('dni').focus();
      } else {
        setErrorApi(error.message);
      }
      setEnviando(false);
    }
  }

  return (
    <div className="agregar-familiar">
      <CabeceraPantalla titulo="Agregar familiar" volverA="/socios/datos" />

      <form className="formulario agregar-familiar__formulario" onSubmit={agregar} noValidate>
        <Campo id="nombre" etiqueta="Nombre" maxLength={100} value={familiar.nombre} onChange={cambiar} error={errores.nombre} />
        <Campo id="apellido" etiqueta="Apellido" maxLength={100} value={familiar.apellido} onChange={cambiar} error={errores.apellido} />
        <Campo
          id="dni"
          etiqueta="DNI"
          inputMode="numeric"
          maxLength={8}
          value={familiar.dni}
          onChange={cambiar}
          error={errores.dni}
        />
        <Campo
          id="parentesco"
          etiqueta="Parentesco"
          maxLength={50}
          placeholder="Hijo, hija, cónyuge…"
          value={familiar.parentesco}
          onChange={cambiar}
          error={errores.parentesco}
        />

        {errorApi && <Mensaje tipo="error">{errorApi}</Mensaje>}

        <button type="submit" className="boton boton--primario agregar-familiar__boton" disabled={enviando}>
          {enviando ? 'Agregando…' : 'Agregar'}
        </button>
      </form>
    </div>
  );
}