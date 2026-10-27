const express = require('express');
const controlador = require('../controllers/auth.controller');

const router = express.Router();

// Públicas
router.post('/registro', controlador.registro);
router.post('/login', controlador.login);

module.exports = router;
