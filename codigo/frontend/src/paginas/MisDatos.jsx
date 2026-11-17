import EnConstruccion from './EnConstruccion';

// R3 — Mis datos (08 y 08c del prototipo)
// API: GET y PUT /socios/me, PUT /socios/me/password, POST /socios/me/baja, GET y DELETE /grupo-familia
export default function MisDatos() {
  return <EnConstruccion titulo="Mis datos" />;
}