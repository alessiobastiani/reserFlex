const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../middleware/authMiddleware');
const configuracionController = require('../controllers/ConfiguracionController');

// Ruta para actualizar la configuración
router.put('/', ensureAuthenticated, configuracionController.actualizarConfiguracion);

// Ruta para obtener la configuración del límite de reservas
router.get('/', ensureAuthenticated, configuracionController.obtenerLimiteReservas);

// Ruta para obtener el tiempo de anticipación en horas
router.get('/anticipacion', ensureAuthenticated, configuracionController.obtenerTiempoAnticipacion);

// Ruta para obtener los horarios de los servicios
router.get('/horarios', ensureAuthenticated, configuracionController.obtenerHorarios);


module.exports = router;
