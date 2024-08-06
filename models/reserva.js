// models/reserva.js
const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  telefono: { type: String, required: true },
  fecha: { type: Date, required: true },
  cantidadPersonas: { type: Number, required: true },
  tipoServicio: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  estado: { type: String, default: 'confirmada' }, // Nuevo campo para manejar el estado
  createdAt: { type: Date, default: Date.now },
});

const Reserva = mongoose.model('Reserva', reservaSchema);

module.exports = Reserva;
