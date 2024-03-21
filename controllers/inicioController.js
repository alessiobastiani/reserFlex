// inicioController.js
const reservaController = require('../controllers/reservaController');

const inicio = async (req, res) => {
  try {
    // Obtener las reservas del usuario actual
    const reservas = await reservaController.obtenerReservasDelUsuario(req.user._id);
    res.json(reservas); // Devolver las reservas como JSON
  } catch (error) {
    console.error('Error al obtener las reservas:', error);
    res.status(500).json({ message: 'No se pudieron obtener las reservas' });
  }
};

module.exports = {
  inicio,
};
