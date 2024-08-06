// notificacionesRoutes.js
const express = require('express');
const { crearNotificacion, obtenerNotificaciones, marcarComoLeida } = require('../controllers/controladorNotificaciones');
const ensureAuthenticated = require('../middleware/authMiddleware'); // Importa el middleware
const router = express.Router();

// Ruta para crear una nueva notificación
router.post('/create', ensureAuthenticated, crearNotificacion);

// Ruta para obtener todas las notificaciones no leídas
router.get('/', ensureAuthenticated, obtenerNotificaciones);

// Ruta para marcar una notificación como leída
router.put('/:id', ensureAuthenticated, marcarComoLeida);

module.exports = router;
