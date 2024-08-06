const Notification = require('../models/notificationModel');
const Reserva = require('../models/reserva');
const User = require('../models/user');

const crearNotificacion = async (req, res) => {
  try {
    const { userId, reservaId } = req.body;
    const user = await User.findById(userId).exec();
    const reserva = await Reserva.findById(reservaId).exec();

    if (!user || !reserva) {
      return res.status(404).json({ message: 'Usuario o reserva no encontrada' });
    }

    const fechaFormato = reserva.fecha.toLocaleDateString('es-ES');
    const message = `El usuario ${user.username} ha solicitado cancelar la reserva "${reserva.nombre}" con la fecha ${fechaFormato}.`;

    const notification = new Notification({ userId, message });
    await notification.save();

    res.status(201).json({ message: 'Notificación creada correctamente' });
  } catch (error) {
    console.error('Error al crear la notificación:', error);
    res.status(400).json({ message: error.message });
  }
};


const obtenerNotificaciones = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    const isAdmin = req.user.role === 'admin';
    const notifications = isAdmin
      ? await Notification.find({ leida: false }).populate('userId').exec()
      : await Notification.find({ userId: req.user.id, leida: false }).populate('userId').exec();

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener notificaciones' });
  }
};

const marcarComoLeida = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({ message: 'Notificación no encontrada' });
    }

    notification.leida = true;
    await notification.save();

    // Cambia el estado de la reserva si existe
    let reserva = null;
    if (notification.reservaId) {
      reserva = await Reserva.findByIdAndUpdate(notification.reservaId, { estado: 'cancelada' }, { new: true });
    }

    res.json({ message: 'Notificación marcada como leída y estado de reserva actualizado', reserva });
  } catch (error) {
    res.status(500).json({ message: 'Error al marcar notificación como leída' });
  }
};



module.exports = { crearNotificacion, obtenerNotificaciones, marcarComoLeida };