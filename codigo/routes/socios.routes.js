const express = require('express');
const controlador = require('../controllers/socios.controller');
const autenticacion = require('../middlewares/autenticacion');
const soloAdmin = require('../middlewares/soloAdmin');

const router = express.Router();

// Del socio logueado
router.get('/me', autenticacion, controlador.verMiPerfil);
router.put('/me', autenticacion, controlador.actualizarMiPerfil);
router.put('/me/password', autenticacion, controlador.cambiarPassword);
router.post('/me/baja', autenticacion, controlador.solicitarBaja);

// Solo admin
router.get('/', autenticacion, soloAdmin, controlador.listar);
router.get('/:id', autenticacion, soloAdmin, controlador.obtener);
router.put('/:id', autenticacion, soloAdmin, controlador.actualizar);
router.delete('/:id', autenticacion, soloAdmin, controlador.eliminar);

module.exports = router;
