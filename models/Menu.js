const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: null
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Entradas', 'Ensaladas', 'Sopas y Caldos', 'Carnes', 'Pescados y Mariscos',
      'Pastas', 'Arroces', 'Platos Vegetarianos', 'Postres',
      'Bebidas', 'Especialidades de la Casa', 'Menú Infantil', 'Opciones sin Gluten / Veganas'
    ]
  }
});

module.exports = mongoose.model('Menu', menuSchema);
