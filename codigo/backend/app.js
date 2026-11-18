const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();

// Carpeta del sitio ya compilado (npm run build en codigo/frontend)
const dist = path.join(__dirname, '..', 'frontend', 'dist');

// Solo el frontend del sitio puede leer la API desde el navegador.
// Con el sitio servido desde acá ya no hace falta, pero sigue sirviendo para npm run dev.
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

// 1. La API
app.use('/api/novedades', require('./routes/novedades.routes'));
app.use('/api/actividades', require('./routes/actividades.routes'));
app.use('/api/profesores', require('./routes/profesores.routes'));
app.use('/api/instalaciones', require('./routes/instalaciones.routes'));
app.use('/api/sponsors', require('./routes/sponsors.routes'));
app.use('/api/buscar', require('./routes/buscar.routes'));
app.use('/api/grupo-familia', require('./routes/grupoFamilia.routes'));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/socios', require('./routes/socios.routes'));
app.use('/api/cuotas', require('./routes/cuotas.routes'));

// Una ruta de la API que no existe: 404 en JSON (nunca la página del sitio)
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'No existe' });
});

// 2. Los archivos del sitio (index.html, estilos, JavaScript, imágenes)
app.use(express.static(dist));

// 3. Cualquier otra dirección es una pantalla de React: se devuelve index.html
// y React dibuja la que corresponde
app.get('/{*ruta}', (req, res) => {
  res.sendFile(path.join(dist, 'index.html'));
});

// Si algo falló en cualquier ruta: 500.
// El detalle se muestra en la terminal
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error del servidor' });
});

module.exports = app;