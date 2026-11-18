import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import CabeceraPantalla from '../componentes/CabeceraPantalla';
import Campo from '../componentes/Campo';
import Tarjeta from '../componentes/Tarjeta';
import Icono from '../componentes/Icono';
import { Cargando, ErrorCarga, Mensaje, Vacio } from '../componentes/Estados';
import { pedir } from '../servicios/api';
import { cerrarSesion } from '../servicios/sesion';
import './AdminSocios.css';

// Admin — Socios (12 del prototipo)
// API: GET /socios?q=&estado= y PUT /socios/:id

const FILTROS = [
  { valor: '', texto: 'Todos' },
  { valor: 'Activo', texto: 'Activos' },
  { valor: 'Baja solicitada', texto: 'Baja solicitada' },
  { valor: 'Inactivo', texto: 'Inactivos' },
];

// Botones de cada socio según su estado
const ACCIONES = {
  'Baja solicitada': [
    { texto: 'Confirmar baja', estado: 'Inactivo', clase: 'boton--primario' },
    { texto: 'Mantener activo', estado: 'Activo', clase: 'boton--secundario' },
  ],
  Activo: [{ texto: 'Dar de baja', estado: 'Inactivo', clase: 'boton--secundario' }],
  Inactivo: [{ texto: 'Reactivar', estado: 'Activo', clase: 'boton--secundario' }],
};

export default function AdminSocios() {
  const navegar = useNavigate();
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState('');

  const [socios, setSocios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [intento, setIntento] = useState(0);

  const [aviso, setAviso] = useState(null);
  // Id del socio que se está guardando, para desactivar solo sus botones
  const [guardando, setGuardando] = useState(null);

  // Busca cada vez que cambia el texto o el filtro
  useEffect(() => {
    async function cargar() {
      setCargando(true);
      setError('');
      try {
        const parametros = new URLSearchParams();
        if (busqueda.trim()) parametros.set('q', busqueda.trim());
        if (filtro) parametros.set('estado', filtro);
        const lista = await pedir(`/socios?${parametros}`);
        // El admin no aparece en la lista de socios
        setSocios(lista.filter((s) => s.rol === 'socio'));
      } catch (e) {
        setError(e.message);
      } finally {
        setCargando(false);
      }
    }
    // Espera un poco a que termine de escribir antes de buscar
    const espera = setTimeout(cargar, 300);
    return () => clearTimeout(espera);
  }, [busqueda, filtro, intento]);

  async function cambiarEstado(socio, accion) {
    const nombre = `${socio.nombre} ${socio.apellido}`;
    if (accion.estado === 'Inactivo'
      && !window.confirm(`¿Seguro que querés dar de baja a ${nombre}? No va a recibir más cuotas.`)) {
      return;
    }
    setGuardando(socio.id_socio);
    setAviso(null);
    try {
      const actualizado = await pedir(`/socios/${socio.id_socio}`, 'PUT', { estado: accion.estado });
      // Lo cambiamos en la lista. Si ya no coincide con el filtro, sale de la lista
      setSocios(
        socios
          .map((s) => (s.id_socio === socio.id_socio ? actualizado : s))
          .filter((s) => !filtro || s.estado === filtro)
      );
      setAviso({ tipo: 'exito', texto: `${nombre} ahora está ${accion.estado.toLowerCase()}.` });
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
    contenido = <Cargando texto="Buscando socios…" />;
  } else if (error) {
    contenido = <ErrorCarga mensaje={error} alReintentar={() => setIntento(intento + 1)} />;
  } else if (socios.length === 0) {
    contenido = (
      <Vacio icono="search_off" titulo="No encontramos socios">
        Probá con otro nombre, DNI o email, o cambiá el filtro.
      </Vacio>
    );
  } else {
    contenido = (
      <div className="lista-tarjetas">
        {socios.map((s) => (
          <Tarjeta key={s.id_socio} titulo={`${s.nombre} ${s.apellido}`} texto={`DNI ${s.dni}`}>
            <p className="tarjeta__texto">{s.email}</p>
            <p className="admin-socios__etiqueta">Estado</p>
            <p className="tarjeta__texto">{s.estado}</p>
            <div className="admin-socios__botones">
              {(ACCIONES[s.estado] ?? []).map((accion) => (
                <button
                  key={accion.texto}
                  type="button"
                  className={`boton ${accion.clase}`}
                  onClick={() => cambiarEstado(s, accion)}
                  disabled={guardando === s.id_socio}
                >
                  {accion.texto}
                </button>
              ))}
            </div>
          </Tarjeta>
        ))}
      </div>
    );
  }

  return (
    <div className="admin-socios">
      <CabeceraPantalla titulo="Socios" volverA="/admin" />

      <Campo
        id="busqueda"
        etiqueta={<><Icono nombre="search" tamano={20} />Buscar</>}
        type="search"
        placeholder="Nombre, DNI o email…"
        maxLength={100}
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <div className="admin-socios__filtros" role="group" aria-label="Filtrar por estado">
        {FILTROS.map((f) => (
          <button
            key={f.texto}
            type="button"
            className={filtro === f.valor ? 'boton boton--primario' : 'boton boton--secundario admin-socios__filtro'}
            aria-pressed={filtro === f.valor}
            onClick={() => setFiltro(f.valor)}
          >
            {f.texto}
          </button>
        ))}
      </div>

      {aviso && <Mensaje tipo={aviso.tipo}>{aviso.texto}</Mensaje>}

      {contenido}

      <div className="admin-socios__acciones">
        <button type="button" className="boton boton--primario" onClick={salir}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}