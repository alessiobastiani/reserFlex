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

module.exports = router;
