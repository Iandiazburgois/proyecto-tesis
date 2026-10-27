const express = require('express');
const controlador = require('../controllers/cuotas.controller');
const autenticacion = require('../middlewares/autenticacion');
const soloAdmin = require('../middlewares/soloAdmin');

const router = express.Router();

// Del socio logueado
router.get('/mias', autenticacion, controlador.misCuotas);
router.put('/:id/comprobante', autenticacion, controlador.enviarComprobante);

// Solo admin
router.get('/', autenticacion, soloAdmin, controlador.listar);
router.get('/:id', autenticacion, soloAdmin, controlador.obtener);
router.post('/', autenticacion, soloAdmin, controlador.crear);
router.put('/:id', autenticacion, soloAdmin, controlador.actualizar);
router.delete('/:id', autenticacion, soloAdmin, controlador.eliminar);

module.exports = router;
