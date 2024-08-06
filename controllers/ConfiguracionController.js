const Configuracion = require('../models/Configuracion');

const actualizarConfiguracion = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
    }

    const { limiteReservasPorDia, tiempoAnticipacionReservas, horarios, fechasCerradas } = req.body;

    if (isNaN(limiteReservasPorDia) || limiteReservasPorDia < 0) {
      return res.status(400).json({ message: 'El límite de reservas por día debe ser un número positivo' });
    }

    if (isNaN(tiempoAnticipacionReservas) || tiempoAnticipacionReservas < 0) {
      return res.status(400).json({ message: 'El tiempo de anticipación debe ser un número positivo' });
    }

    // Convertir las fechas a objetos Date
    const fechasCerradasDates = fechasCerradas.map(fecha => new Date(fecha));

    const configuracion = await Configuracion.findOneAndUpdate(
      {},
      {
        limiteReservasPorDia,
        tiempoAnticipacionReservas,
        horarios,
        fechasCerradas: fechasCerradasDates // Actualizar con fechas convertidas
      },
      { new: true, upsert: true }
    );

    res.status(200).json(configuracion);
  } catch (error) {
    console.error('Error al actualizar la configuración:', error);
    res.status(500).json({ message: 'Ocurrió un error al actualizar la configuración' });
  }
};


const obtenerFechasCerradas = async (req, res) => {
  try {
    const configuracion = await Configuracion.findOne();

    if (!configuracion) {
      return res.status(404).json({ message: 'No se encontró configuración' });
    }

    if (!configuracion.fechasCerradas || configuracion.fechasCerradas.length === 0) {
      return res.status(404).json({ message: 'No se encontraron fechas cerradas en la configuración' });
    }

    res.status(200).json({ fechasCerradas: configuracion.fechasCerradas });
  } catch (error) {
    console.error('Error al obtener las fechas cerradas:', error);
    res.status(500).json({ message: 'Ocurrió un error al obtener las fechas cerradas' });
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

const eliminarFechaCerrada = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
    }

    const { date } = req.params;

    const configuracion = await Configuracion.findOneAndUpdate(
      {},
      { $pull: { fechasCerradas: new Date(date) } },
      { new: true }
    );

    if (!configuracion) {
      return res.status(404).json({ message: 'Configuración no encontrada' });
    }

    res.status(200).json({ message: 'Fecha cerrada eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la fecha cerrada:', error);
    res.status(500).json({ message: 'Ocurrió un error al eliminar la fecha cerrada' });
  }
};

module.exports = {
  actualizarConfiguracion,
  obtenerLimiteReservas,
  obtenerTiempoAnticipacion,
  obtenerHorarios,
  obtenerFechasCerradas,
  eliminarFechaCerrada
};

