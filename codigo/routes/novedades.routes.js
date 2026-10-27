const express = require('express');
const controlador = require('../controllers/novedades.controller');
const autenticacion = require('../middlewares/autenticacion');
const soloAdmin = require('../middlewares/soloAdmin');

const router = express.Router();

// Públicas
router.get('/', controlador.listar);
router.get('/:id', controlador.obtener);

// Solo admin
router.post('/', autenticacion, soloAdmin, controlador.crear);
router.put('/:id', autenticacion, soloAdmin, controlador.actualizar);
router.delete('/:id', autenticacion, soloAdmin, controlador.eliminar);

module.exports = router;
