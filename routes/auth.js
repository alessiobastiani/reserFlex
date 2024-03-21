const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const inicioController = require('../controllers/inicioController');
const ensureAuthenticated = require('../middleware/authMiddleware');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/users', ensureAuthenticated, authController.getUsers);
router.get('/inicio', ensureAuthenticated, inicioController.inicio); // Ruta protegida

module.exports = router;
