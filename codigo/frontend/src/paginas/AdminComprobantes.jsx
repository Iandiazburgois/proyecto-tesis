import EnConstruccion from './EnConstruccion';

// Admin — Comprobantes por revisar (10 del prototipo)
// API: GET /cuotas?estado=En revisión, PUT /cuotas/:id
export default function AdminComprobantes() {
  return <EnConstruccion titulo="Comprobantes por revisar" />;
}