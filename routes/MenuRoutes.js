const express = require('express');
const router = express.Router();
const MenuController = require('../controllers/MenuController');

// Obtener todos los menús
router.get('/', MenuController.getMenus);

// Añadir un nuevo menú
router.post('/', MenuController.addMenu);

// Actualizar un menú por ID
router.put('/:id', MenuController.updateMenu);

// Eliminar un menú por ID
router.delete('/:id', MenuController.deleteMenu);

module.exports = router;
