const Menu = require('../models/Menu');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración de almacenamiento de multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// Obtener todos los menús
const getMenus = async (req, res) => {
  try {
    const menus = await Menu.find();
    res.json({ menus });
  } catch (error) {
    console.error('Error al obtener los menús:', error);
    res.status(500).json({ message: 'Error al obtener los menús' });
  }
};

// Añadir un nuevo menú
const addMenu = async (req, res) => {
  try {
    const { name, description, category } = req.body;

    // Validación de campos
    if (!name || !description || !category) {
      return res.status(400).json({ message: 'Faltan datos requeridos' });
    }

    const imageUrl = req.file ? req.file.filename : null;
    const newMenu = new Menu({ name, description, category, imageUrl });
    await newMenu.save();
    res.status(201).json(newMenu);
  } catch (error) {
    console.error('Error al añadir el menú:', error);
    res.status(500).json({ message: 'Error al añadir el menú' });
  }
};

// Actualizar un menú por ID
const updateMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category } = req.body;

    // Validación de campos
    if (!name || !description || !category) {
      return res.status(400).json({ message: 'Faltan datos requeridos' });
    }

    const imageUrl = req.file ? req.file.filename : null;
    const updatedData = { name, description, category };
    if (imageUrl) updatedData.imageUrl = imageUrl;

    const updatedMenu = await Menu.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedMenu) {
      return res.status(404).json({ message: 'Menú no encontrado' });
    }

    res.json(updatedMenu);
  } catch (error) {
    console.error('Error al actualizar el menú:', error);
    res.status(500).json({ message: 'Error al actualizar el menú' });
  }
};

// Eliminar un menú por ID
const deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMenu = await Menu.findByIdAndDelete(id);

    if (!deletedMenu) {
      return res.status(404).json({ message: 'Menú no encontrado' });
    }

    // Eliminar imagen si existe
    if (deletedMenu.imageUrl) {
      const filePath = path.join(__dirname, '../uploads/', deletedMenu.imageUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.json({ message: 'Menú eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el menú:', error);
    res.status(500).json({ message: 'Error al eliminar el menú' });
  }
};

module.exports = {
  getMenus,
  addMenu: [upload.single('image'), addMenu],
  updateMenu: [upload.single('image'), updateMenu],
  deleteMenu,
};
