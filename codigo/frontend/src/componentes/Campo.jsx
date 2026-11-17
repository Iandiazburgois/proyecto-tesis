import Icono from './Icono';

// Campo de formulario: etiqueta, input y, si hay, el mensaje de error o de ayuda debajo.
// "error" puede ser un texto (borde rojo + mensaje) o true (solo borde rojo, el mensaje va en otro lado).
export default function Campo({ id, etiqueta, error, ayuda, ...resto }) {
  const tieneError = Boolean(error);
  const textoError = typeof error === 'string' ? error : '';

  // El mensaje se conecta con el input para que el lector de pantalla lo lea
  const idMensaje = textoError || ayuda ? `${id}-mensaje` : undefined;

  return (
    <div className="campo">
      <label htmlFor={id}>{etiqueta}</label>

      {/* Con error, se agrega la clase que pone el borde rojo */}
      <input
        id={id}
        name={id}
        className={tieneError ? 'campo__input campo__input--error' : 'campo__input'}
        aria-invalid={tieneError ? true : undefined}
        aria-describedby={idMensaje}
        {...resto}
      />

      {/* Si hay texto de error se muestra; si no, la ayuda (si tiene) */}
      {textoError ? (
        <p id={idMensaje} className="campo__error">
          <Icono nombre="warning" tamano={20} />
          {textoError}
        </p>
      ) : (
        ayuda && <p id={idMensaje} className="campo__ayuda">{ayuda}</p>
      )}
    </div>
  );
}