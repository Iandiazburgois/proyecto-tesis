import EnConstruccion from './EnConstruccion';

// R3 — Estado de cuota (05 y 05b del prototipo)
// API: GET /cuotas/mias
export default function EstadoCuota() {
  return <EnConstruccion titulo="Estado de la cuota y pagos" />;
}