const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  telefono: { type: String, required: true }, // Nuevo campo para el número de teléfono
  fecha: { type: Date, required: true },
  cantidadPersonas: { type: Number, required: true },
  tipoServicio: { type: String, required: true }, // Nuevo campo para el tipo de servicio
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});


const Reserva = mongoose.model('Reserva', reservaSchema);

module.exports = Reserva;
