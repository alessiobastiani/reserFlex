const Reserva = require('../models/reserva');
const mongoose = require('mongoose');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

// Importa y configura dayjs con los plugins necesarios
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Argentina/Buenos_Aires');

const obtenerReservas = async (req, res) => {
  try {
    const userId = req.user.id; // Obtener el userId del usuario autenticado
    console.log('UserID:', userId); // Agregar este log para depuración
    const reservas = await Reserva.find({ userId }); // Filtrar reservas por userId
    res.json({ reservas });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const crearReserva = async (req, res) => {
  try {
    const { nombre, telefono, fecha, cantidadPersonas, tipoServicio } = req.body;
    const userId = req.user.id;

    // Convierte la fecha y hora a la zona horaria correcta antes de guardarla en la base de datos
    const fechaHoraConvertida = dayjs(fecha).tz('America/Argentina/Buenos_Aires');

    const reserva = new Reserva({
      nombre,
      telefono,
      fecha: fechaHoraConvertida,
      cantidadPersonas,
      tipoServicio,
      userId: userId,
    });

    const nuevaReserva = await reserva.save();
    res.status(201).json(nuevaReserva); // Devuelve la nueva reserva en la respuesta
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const eliminarReserva = async (req, res) => {
  try {
    const { id } = req.params;

    // Agregar un log para depuración
    console.log('UserID:', req.user.id);

    // Verificar que la reserva a eliminar pertenece al usuario autenticado
    const reserva = await Reserva.findOne({ _id: id, userId: req.user.id });

    if (!reserva) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    await Reserva.findByIdAndDelete(id);
    res.json({ message: 'Reserva eliminada correctamente' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const actualizarReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, fecha, cantidadPersonas } = req.body;

    // No es necesario verificar el usuario para los administradores
    const reservaActualizada = await Reserva.findByIdAndUpdate(
      id,
      { nombre, fecha, cantidadPersonas },
      { new: true }
    );

    res.json(reservaActualizada);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const obtenerUltimaReserva = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Validar que userId sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'El ID del usuario no es válido' });
    }

    // Buscar la última reserva del usuario ordenada por fecha de creación descendente
    const ultimaReserva = await Reserva.findOne({ userId }).sort({ createdAt: -1 });

    // Verificar si se encontró alguna reserva
    if (!ultimaReserva) {
      return res.status(404).json({ message: 'No se encontró ninguna reserva para este usuario' });
    }

    // Devolver la última reserva encontrada
    res.json({ reserva: ultimaReserva });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const obtenerReservasHoy = async (req, res) => {
  try {
    // Obtener la fecha actual en la zona horaria de Buenos Aires
    const today = dayjs().tz('America/Argentina/Buenos_Aires').startOf('day');
    
    // Obtener la fecha de mañana en la zona horaria de Buenos Aires
    const tomorrow = today.add(1, 'day');

    // Buscar todas las reservas para el día de hoy (sin filtrar por userId)
    const reservasHoy = await Reserva.find({ fecha: { $gte: today.toDate(), $lt: tomorrow.toDate() } });
    
    res.json({ reservas: reservasHoy });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const obtenerUltimasReservas = async (req, res) => {
  try {
    // Obtener las últimas 6 reservas ordenadas por fecha de creación descendente
    const ultimasReservas = await Reserva.find().sort({ createdAt: -1 }).limit(6);

    // Verificar si se encontraron reservas
    if (!ultimasReservas || ultimasReservas.length === 0) {
      return res.status(404).json({ message: 'No se encontraron reservas recientes' });
    }

    // Devolver las últimas 6 reservas encontradas
    res.json({ reservas: ultimasReservas });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const obtenerReservasUltimoMes = async (req, res) => {
  try {
    // Obtener la fecha actual en formato UTC
    const fechaActualUtc = dayjs().utc().toDate();

    // Obtener la fecha de inicio del último mes en formato UTC
    const fechaInicioMesUtc = dayjs().subtract(1, 'month').startOf('month').utc().toDate();
    
    // Obtener la fecha de fin del último mes en formato UTC
    const fechaFinMesUtc = dayjs(fechaActualUtc).subtract(1, 'day').endOf('month').utc().toDate();

    // Consultar las reservas en el último mes sin filtrar por usuario
    const reservasUltimoMes = await Reserva.find({ fecha: { $gte: fechaInicioMesUtc, $lte: fechaFinMesUtc } });
    
    res.json({ reservas: reservasUltimoMes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const obtenerCantidadReservas = async (req, res) => {
  try {
    const totalReservas = await Reserva.countDocuments();
    res.json({ totalReservas });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const obtenerReservasPorTipo = async (req, res) => {
  try {
    // Obtener todas las reservas
    const reservas = await Reserva.find();
    
    // Inicializar un objeto para almacenar el recuento de cada tipo de reserva
    const countByType = {};
    
    // Contar cuántas reservas hay de cada tipo
    reservas.forEach((reserva) => {
      const tipo = reserva.tipoServicio;
      countByType[tipo] = countByType[tipo] ? countByType[tipo] + 1 : 1;
    });
    
    // Devolver el objeto con el recuento de reservas por tipo
    res.json(countByType);
  } catch (error) {
    console.error('Error al obtener reservas por tipo:', error);
    res.status(500).json({ message: 'Error al obtener reservas por tipo' });
  }
};

const obtenerTodasReservas = async (req, res) => {
  try {
    const reservas = await Reserva.find(); // Obtener todas las reservas sin filtrar
    res.json({ reservas });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  obtenerReservas,
  crearReserva,
  obtenerUltimaReserva,
  obtenerUltimasReservas,
  actualizarReserva,
  eliminarReserva,
  obtenerReservasHoy,
  obtenerReservasUltimoMes, // Agregar esta función a las exportaciones
  obtenerCantidadReservas,
  obtenerReservasPorTipo,
  obtenerTodasReservas
};
