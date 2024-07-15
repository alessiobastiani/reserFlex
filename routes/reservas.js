//reservas.js

const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../middleware/authMiddleware');
const reservaController = require('../controllers/reservaController');

// Rutas existentes
router.get('/', ensureAuthenticated, reservaController.obtenerReservas);
router.post('/', ensureAuthenticated, reservaController.crearReserva);
router.put('/:id', ensureAuthenticated, reservaController.actualizarReserva);
router.delete('/:id', ensureAuthenticated, reservaController.eliminarReserva);
router.get('/latest/:userId', ensureAuthenticated, reservaController.obtenerUltimaReserva);
router.get('/latests', ensureAuthenticated, reservaController.obtenerUltimasReservas);
router.get('/reservas-hoy', ensureAuthenticated, reservaController.obtenerReservasHoy);
router.get('/reservas-ultimo-mes', ensureAuthenticated, reservaController.obtenerReservasUltimoMes);
router.get('/cantidad-reservas', ensureAuthenticated, reservaController.obtenerCantidadReservas);
router.get('/reservas-por-tipo', ensureAuthenticated, reservaController.obtenerReservasPorTipo);

// Nueva ruta para obtener todas las reservas
router.get('/allReservas', ensureAuthenticated, reservaController.obtenerTodasReservas);

// Nueva ruta para descargar las reservas del último mes en formato CSV
router.get('/descargar-reservas-ultimo-mes', ensureAuthenticated, reservaController.descargarReservasUltimoMes);

// Nueva ruta para obtener las reservas de los últimos tres meses
router.get('/reservas-ultimos-tres-meses', ensureAuthenticated, reservaController.obtenerReservasUltimosTresMeses);

// Nueva ruta para obtener las reservas del último año
router.get('/reservas-ultimo-anio', ensureAuthenticated, reservaController.obtenerReservasUltimoAnio);


module.exports = router;
