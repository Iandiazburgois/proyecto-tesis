import EnConstruccion from './EnConstruccion';

// R3 — Enviar comprobante (05c del prototipo)
// API: PUT /cuotas/:id/comprobante
export default function EnviarComprobante() {
  return <EnConstruccion titulo="Enviar comprobante" />;
}