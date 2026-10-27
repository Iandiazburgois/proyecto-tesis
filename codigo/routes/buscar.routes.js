const express = require('express');
const controlador = require('../controllers/buscar.controller');

const router = express.Router();

// Pública
router.get('/', controlador.buscar);

module.exports = router;
