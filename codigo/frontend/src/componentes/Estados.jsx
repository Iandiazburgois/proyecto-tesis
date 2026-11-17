import Icono from './Icono';

// Espera: "Cargando tus cuotas…", "Buscando…".
// role="status" hace que el lector de pantalla lo anuncie.
export function Cargando({ texto = 'Cargando…' }) {
  return (
    <p className="estado" role="status">
      {texto}
    </p>
  );
}

// Mensaje de éxito o de error (guía 5.5): siempre ícono + texto
export function Mensaje({ tipo = 'error', children }) {
  return (
    <div className={`mensaje mensaje--${tipo}`} role={tipo === 'error' ? 'alert' : 'status'}>
      <Icono nombre={tipo === 'error' ? 'warning' : 'check_circle'} />
      <p>{children}</p>
    </div>
  );
}

// Error al cargar datos: explica qué pasó y deja reintentar.
// Así una respuesta que falla nunca deja la pantalla en blanco (7.5).
export function ErrorCarga({ mensaje, alReintentar }) {
  return (
    <div className="estado">
      <Mensaje tipo="error">{mensaje}</Mensaje>
      {alReintentar && (
        <button type="button" className="boton boton--secundario" onClick={alReintentar}>
          Reintentar
        </button>
      )}
    </div>
  );
}

// Vacío: "Búsqueda sin resultados", "No tenés familiares cargados"
export function Vacio({ icono = 'search_off', titulo, children }) {
  return (
    <div className="estado">
      <span className="estado__icono">
        <Icono nombre={icono} tamano={48} />
      </span>
      <h3>{titulo}</h3>
      {children}
    </div>
  );
}