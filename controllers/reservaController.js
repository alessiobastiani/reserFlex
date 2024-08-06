//resercaController.js
const Reserva = require('../models/reserva');
const mongoose = require('mongoose');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const { parse } = require('json2csv');
const { Parser } = require('json2csv');
const Configuracion = require('../models/Configuracion'); // Asegúrate de que la ruta al modelo sea correcta
const Notification = require('../models/notificationModel'); // Importa el modelo Notification


// Resto del código del controlador


// Importa y configura dayjs con los plugins necesarios
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Argentina/Buenos_Aires');

const obtenerReservasPorDia = async (fecha) => {
  try {
    // Obtener la fecha de inicio y fin del día en formato UTC
    const inicioDia = dayjs(fecha).startOf('day').utc().toDate();
    const finDia = dayjs(fecha).endOf('day').utc().toDate();

    // Buscar todas las reservas para el día especificado
    const reservasDia = await Reserva.find({ fecha: { $gte: inicioDia, $lte: finDia } });
    return reservasDia;
  } catch (error) {
    console.error('Error al obtener las reservas por día:', error);
    throw new Error('Error al obtener las reservas por día');
  }
};



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

    // Convertir la fecha y hora a la zona horaria correcta antes de guardarla en la base de datos
    const fechaHoraConvertida = dayjs(fecha).tz('America/Argentina/Buenos_Aires');

    // Validar que la reserva sea para el día actual o fechas futuras
    const fechaActual = dayjs().startOf('minute'); // Comprobar desde el inicio del minuto actual
    if (fechaHoraConvertida.isBefore(fechaActual)) {
      return res.status(400).json({ message: 'No se pueden hacer reservas para fechas pasadas' });
    }

    // Validar que la reserva no sea más de un año en el futuro
    const fechaMaxima = fechaActual.add(1, 'year');
    if (fechaHoraConvertida.isAfter(fechaMaxima)) {
      return res.status(400).json({ message: 'No se pueden hacer reservas más de un año en adelante' });
    }

    // Obtener la configuración de tiempo de anticipación y límite de reservas por día
    const configuracion = await Configuracion.findOne();
    if (!configuracion) {
      return res.status(500).json({ message: 'No se encontró la configuración de reserva' });
    }

    const tiempoAnticipacionReservas = configuracion.tiempoAnticipacionReservas || 0; // Valor por defecto si la configuración no está definida
    const limiteReservasPorDia = configuracion.limiteReservasPorDia || 3; // Valor por defecto si la configuración no está definida

    // Validar que la reserva tenga al menos el tiempo de anticipación configurado
    const horaAnticipacionMinima = fechaActual.add(tiempoAnticipacionReservas, 'hour');
    if (fechaHoraConvertida.isBefore(horaAnticipacionMinima)) {
      return res.status(400).json({ message: `La reserva debe hacerse con al menos ${tiempoAnticipacionReservas} horas de anticipación` });
    }

    const reservasDia = await obtenerReservasPorDia(fechaHoraConvertida);
    console.log('[Backend] Reservas del día:', reservasDia);
    if (reservasDia.length >= limiteReservasPorDia) {
      console.log('[Backend] Límite de reservas alcanzado para este día');
      return res.status(400).json({ message: 'Límite de reservas alcanzado' });
    }

    // Crear la reserva
    const reserva = new Reserva({
      nombre,
      telefono,
      fecha: fechaHoraConvertida,
      cantidadPersonas,
      tipoServicio,
      userId,
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

    // Verificar si el usuario es admin
    if (req.user.role === 'admin') {
      // Si es admin, eliminar la reserva sin verificar el userId
      await Reserva.findByIdAndDelete(id);
      return res.json({ message: 'Reserva eliminada correctamente' });
    }

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
    const { nombre, fecha, cantidadPersonas, tipoServicio, telefono } = req.body; // Incluir `telefono`

    // No es necesario verificar el usuario para los administradores
    const reservaActualizada = await Reserva.findByIdAndUpdate(
      id,
      { nombre, fecha, cantidadPersonas, tipoServicio, telefono }, // Incluir `telefono`
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

const descargarReservasUltimoMes = async (req, res) => {
  try {
    // Obtener la fecha de inicio y fin del mes actual
    const inicioMesActual = dayjs().startOf('month');
    const finMesActual = dayjs().endOf('month');

    // Obtener las reservas del último mes ordenadas por fecha de creación descendente
    const reservasUltimoMes = await Reserva.find({
      createdAt: {
        $gte: inicioMesActual.toDate(),
        $lte: finMesActual.toDate()
      }
    }).sort({ createdAt: -1 }); // Ordenar por fecha de creación descendente

    // Crear el encabezado del informe
    const header = `Informe de Reservas del último Mes\nFecha de generación: ${dayjs().format('DD/MM/YYYY HH:mm')}\n\n`;

    // Mapear las reservas a un formato compatible con json2csv
    const csvData = reservasUltimoMes.map(reserva => ({
      Nombre: reserva.nombre,
      Teléfono: reserva.telefono,
      Fecha: dayjs(reserva.fecha).format('DD/MM/YYYY HH:mm'),
      'Cantidad de Personas': reserva.cantidadPersonas,
      'Tipo de Servicio': reserva.tipoServicio
    }));

    // Configurar opciones de json2csv
    const opts = {
      fields: ['Nombre', 'Teléfono', 'Fecha', 'Cantidad de Personas', 'Tipo de Servicio'],
      delimiter: ';',
      utf8ByteOrderMark: true
    };

    // Convertir los datos a formato CSV
    const parser = new Parser(opts);
    const csv = `${header}${parser.parse(csvData)}`; // Agregar el encabezado al inicio del archivo CSV

    // Establecer las cabeceras de la respuesta para indicar que se va a descargar un archivo CSV
    res.setHeader('Content-Disposition', 'attachment; filename="reservas-ultimo-mes.csv"');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8'); // Especificar UTF-8 como codificación de caracteres

    // Enviar el archivo CSV como respuesta
    res.status(200).send(csv);
  } catch (error) {
    console.error('Error al descargar el informe de reservas del último mes:', error);
    res.status(500).json({ message: 'Error al descargar el informe de reservas del último mes' });
  }
};

const obtenerReservasUltimosTresMeses = async (req, res) => {
  try {
    const fechaActual = dayjs();
    const fechaInicioTresMeses = fechaActual.subtract(3, 'month');

    // Obtener las reservas de los últimos 3 meses ordenadas por fecha de creación descendente
    const reservasUltimosTresMeses = await Reserva.find({
      createdAt: {
        $gte: fechaInicioTresMeses.toDate(),
        $lte: fechaActual.toDate()
      }
    }).sort({ createdAt: -1 }); // Ordenar por fecha de creación descendente

    const header = `Informe de Reservas de los últimos 3 meses\nFecha de generación: ${dayjs().format('DD/MM/YYYY HH:mm')}\n\n`;

    const csvData = reservasUltimosTresMeses.map(reserva => ({
      Nombre: reserva.nombre,
      Teléfono: reserva.telefono,
      Fecha: dayjs(reserva.fecha).format('DD/MM/YYYY HH:mm'),
      'Cantidad de Personas': reserva.cantidadPersonas,
      'Tipo de Servicio': reserva.tipoServicio
    }));

    const opts = {
      fields: ['Nombre', 'Teléfono', 'Fecha', 'Cantidad de Personas', 'Tipo de Servicio'],
      delimiter: ';',
      utf8ByteOrderMark: true
    };

    const parser = new Parser(opts);
    const csv = `${header}${parser.parse(csvData)}`;

    res.setHeader('Content-Disposition', 'attachment; filename="reservas-ultimos-tres-meses.csv"');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');

    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const obtenerReservasUltimoAnio = async (req, res) => {
  try {
    const fechaActual = dayjs();
    const fechaInicioAnio = fechaActual.startOf('year'); // Comienzo del año actual
    const fechaFinMesActual = fechaActual.endOf('month'); // Final del mes actual

    // Obtener las reservas del último año ordenadas por fecha de creación descendente
    const reservasUltimoAnio = await Reserva.find({
      fecha: {
        $gte: fechaInicioAnio.toDate(), // Desde el comienzo del año actual
        $lte: fechaFinMesActual.toDate() // Hasta el final del mes actual
      }
    }).sort({ createdAt: -1 }); // Ordenar por fecha de creación descendente

    const header = `Informe de Reservas del último año\nFecha de generación: ${dayjs().format('DD/MM/YYYY HH:mm')}\n\n`;

    const csvData = reservasUltimoAnio.map(reserva => ({
      Nombre: reserva.nombre,
      Teléfono: reserva.telefono,
      Fecha: dayjs(reserva.fecha).format('DD/MM/YYYY HH:mm'),
      'Cantidad de Personas': reserva.cantidadPersonas,
      'Tipo de Servicio': reserva.tipoServicio
    }));

    const opts = {
      fields: ['Nombre', 'Teléfono', 'Fecha', 'Cantidad de Personas', 'Tipo de Servicio'],
      delimiter: ';',
      utf8ByteOrderMark: true
    };

    const parser = new Parser(opts);
    const csv = `${header}${parser.parse(csvData)}`;

    res.setHeader('Content-Disposition', 'attachment; filename="reservas-ultimo-anio.csv"');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');

    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const cancelarReserva = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que la reserva existe
    const reserva = await Reserva.findById(id).populate('userId');
    if (!reserva) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    // Actualizar el estado de la reserva
    reserva.estado = 'pendiente_cancelacion';
    await reserva.save();

    // Crear una notificación para el administrador
    const user = reserva.userId; // Asumiendo que has poblado el campo userId con el usuario completo

    // Formatear la fecha
    const fechaFormato = reserva.fecha.toLocaleDateString('es-ES');

    // Crear el mensaje de la notificación
    const notificationMessage = `El usuario ${user.username} ha solicitado cancelar la reserva "${reserva.nombre}" con la fecha ${fechaFormato}.`;

    const adminNotification = new Notification({
      userId: user._id,
      message: notificationMessage,
      leida: false, // Asegúrate de que la notificación esté marcada como no leída al crearla
    });
    await adminNotification.save();

    res.json({ message: 'Reserva marcada como pendiente de cancelación y notificación enviada al administrador' });
  } catch (error) {
    res.status(400).json({ message: error.message });
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
  obtenerTodasReservas,
  descargarReservasUltimoMes,
  obtenerReservasUltimoAnio,
  obtenerReservasUltimosTresMeses,
  obtenerReservasPorDia,
  cancelarReserva
};
