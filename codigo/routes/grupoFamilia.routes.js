const express = require('express');
const controlador = require('../controllers/grupoFamilia.controller');
const autenticacion = require('../middlewares/autenticacion');

const router = express.Router();

router.get('/', autenticacion, controlador.listar);
router.get('/:id', autenticacion, controlador.obtener);
router.post('/', autenticacion, controlador.crear);
router.put('/:id', autenticacion, controlador.actualizar);
router.delete('/:id', autenticacion, controlador.eliminar);

module.exports = router;
