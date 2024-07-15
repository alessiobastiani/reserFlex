const Configuracion = require('../models/Configuracion');

const actualizarConfiguracion = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
    }

    const { limiteReservasPorDia, tiempoAnticipacionReservas, horarios } = req.body; // Agregar 'horarios' aquí

    if (isNaN(limiteReservasPorDia) || limiteReservasPorDia < 0) {
      return res.status(400).json({ message: 'El límite de reservas por día debe ser un número positivo' });
    }

    if (isNaN(tiempoAnticipacionReservas) || tiempoAnticipacionReservas < 0) {
      return res.status(400).json({ message: 'El tiempo de anticipación debe ser un número positivo' });
    }

    const configuracion = await Configuracion.findOneAndUpdate(
      {},
      { limiteReservasPorDia, tiempoAnticipacionReservas, horarios }, // Aquí asegúrate de incluir 'horarios'
      { new: true, upsert: true }
    );

    res.status(200).json(configuracion);
  } catch (error) {
    console.error('Error al actualizar la configuración:', error);
    res.status(500).json({ message: 'Ocurrió un error al actualizar la configuración' });
  }
};


const obtenerLimiteReservas = async (req, res) => {
  try {
    const configuracion = await Configuracion.findOne();
    
    if (!configuracion) {
      return res.status(404).json({ message: 'No se encontró la configuración de límite de reservas' });
    }

    res.status(200).json(configuracion);
  } catch (error) {
    console.error('Error al obtener el límite de reservas por día:', error);
    res.status(500).json({ message: 'Ocurrió un error al obtener el límite de reservas por día' });
  }
};
const obtenerTiempoAnticipacion = async (req, res) => {
  try {
    const configuracion = await Configuracion.findOne();
    
    if (!configuracion || !configuracion.tiempoAnticipacionReservas) {
      return res.status(404).json({ message: 'No se encontró el tiempo de anticipación en la configuración' });
    }

    res.status(200).json({ tiempoAnticipacion: configuracion.tiempoAnticipacionReservas });
  } catch (error) {
    console.error('Error al obtener el tiempo de anticipación:', error);
    res.status(500).json({ message: 'Ocurrió un error al obtener el tiempo de anticipación' });
  }
};

const obtenerHorarios = async (req, res) => {
  try {
    const configuracion = await Configuracion.findOne();

    if (!configuracion || !configuracion.horarios) {
      return res.status(404).json({ message: 'No se encontraron horarios en la configuración' });
    }

    res.status(200).json({ horarios: configuracion.horarios });
  } catch (error) {
    console.error('Error al obtener los horarios:', error);
    res.status(500).json({ message: 'Ocurrió un error al obtener los horarios' });
  }
};


module.exports = {
  actualizarConfiguracion,
  obtenerLimiteReservas,
  obtenerTiempoAnticipacion,
  obtenerHorarios // Add this function to exports
};

