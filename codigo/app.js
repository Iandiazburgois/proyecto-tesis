const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ mensaje: 'API REST Club Sportivo San Cayetano funcionando correctamente' });
});

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

// Si ninguna ruta atendió el pedido: 404
app.use((req, res) => {
  res.status(404).json({ error: 'No existe' });
});

// Si algo falló en cualquier ruta: 500.
// El detalle se muestra en la terminal
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error del servidor' });
});

module.exports = app;
