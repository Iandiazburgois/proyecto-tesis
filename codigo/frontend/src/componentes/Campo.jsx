import Icono from './Icono';

// Campo de formulario: etiqueta, input y, si hay, el mensaje de error o de ayuda debajo
export default function Campo({ id, etiqueta, error, ayuda, ...resto }) {
  // El mensaje se conecta con el input para que el lector de pantalla lo lea
  const idMensaje = error || ayuda ? `${id}-mensaje` : undefined;

  return (
    <div className="campo">
      <label htmlFor={id}>{etiqueta}</label>

      {/* Con error, se agrega la clase que pone el borde rojo */}
      <input
        id={id}
        name={id}
        className={error ? 'campo__input campo__input--error' : 'campo__input'}
        aria-invalid={error ? true : undefined}
        aria-describedby={idMensaje}
        {...resto}
      />

      {/* Si hay error se muestra el error; si no, la ayuda (si tiene) */}
      {error ? (
        <p id={idMensaje} className="campo__error">
          <Icono nombre="warning" tamano={20} />
          {error}
        </p>
      ) : (
        ayuda && <p id={idMensaje} className="campo__ayuda">{ayuda}</p>
      )}
    </div>
  );
}