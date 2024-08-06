const mongoose = require('mongoose');

const configuracionSchema = new mongoose.Schema({
  limiteReservasPorDia: { type: Number, default: 0 },
  tiempoAnticipacionReservas: { type: Number, default: 0 },
  horarios: {
    desayuno: { inicio: String, fin: String },
    merienda: { inicio: String, fin: String },
    almuerzo: { inicio: String, fin: String },
    cena: { inicio: String, fin: String }
  },
  fechasCerradas: { type: [Date], default: [] } // Cambiado de diasCerrados a fechasCerradas
});

const Configuracion = mongoose.model('Configuracion', configuracionSchema);

module.exports = Configuracion;
