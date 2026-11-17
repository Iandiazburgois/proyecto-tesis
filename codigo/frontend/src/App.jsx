import { Route, Routes } from 'react-router';
import Plantilla from './componentes/Plantilla';
import RutaProtegida from './componentes/RutaProtegida';
import AdminComprobantes from './paginas/AdminComprobantes';
import AdminNovedades from './paginas/AdminNovedades';
import AdminPanel from './paginas/AdminPanel';
import AdminSocios from './paginas/AdminSocios';
import AgregarFamiliar from './paginas/AgregarFamiliar';
import AreaSocios from './paginas/AreaSocios';
import Buscar from './paginas/Buscar';
import EnviarComprobante from './paginas/EnviarComprobante';
import EstadoCuota from './paginas/EstadoCuota';
import HaceteSocio from './paginas/HaceteSocio';
import IniciarSesion from './paginas/IniciarSesion';
import Inicio from './paginas/Inicio';
import MisDatos from './paginas/MisDatos';
import NoEncontrada from './paginas/NoEncontrada';
import PublicarNovedad from './paginas/PublicarNovedad';

// Mapa de navegación del sitio (etapa 2, punto 2.2).
// Como en el prototipo, el pie va en Inicio, Buscar y Estado de cuota; los formularios van sin pie.
export default function App() {
  return (
    <Routes>
      {/* ---------- Inicio: encabezado completo y pie ---------- */}
      <Route element={<Plantilla conEncabezado />}>
        <Route path="/" element={<Inicio />} />
      </Route>

      {/* ---------- Pantallas internas con pie ---------- */}
      <Route element={<Plantilla />}>
        <Route path="/buscar" element={<Buscar />} />

        {/* Solo con sesión */}
        <Route element={<RutaProtegida />}>
          <Route path="/socios/cuotas" element={<EstadoCuota />} />
          <Route path="/socios/cuotas/:id/comprobante" element={<EnviarComprobante />} />
        </Route>

        {/* Cualquier dirección que no existe */}
        <Route path="*" element={<NoEncontrada />} />
      </Route>

      {/* ---------- Formularios y gestión: sin pie ---------- */}
      <Route element={<Plantilla conPie={false} />}>
        <Route path="/ingresar" element={<IniciarSesion />} />
        <Route path="/hacete-socio" element={<HaceteSocio />} />

        {/* Solo con sesión (área restringida, R3) */}
        <Route element={<RutaProtegida />}>
          <Route path="/socios" element={<AreaSocios />} />
          <Route path="/socios/datos" element={<MisDatos />} />
          <Route path="/socios/datos/familiar" element={<AgregarFamiliar />} />
        </Route>

        {/* Solo el administrador */}
        <Route element={<RutaProtegida soloAdmin />}>
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/comprobantes" element={<AdminComprobantes />} />
          <Route path="/admin/novedades" element={<AdminNovedades />} />
          <Route path="/admin/novedades/nueva" element={<PublicarNovedad />} />
          <Route path="/admin/socios" element={<AdminSocios />} />
        </Route>
      </Route>
    </Routes>
  );
}