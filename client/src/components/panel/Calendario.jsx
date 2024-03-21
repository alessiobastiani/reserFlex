import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { isToday, isPast, isFuture } from 'date-fns';

// Estilizar el contenedor del calendario
const StyledCalendarContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  borderRadius: theme.shape.borderRadius,
}));

const Calendario = () => {
  const [reservas, setReservas] = useState([]);
  const [error, setError] = useState(null);

  // Función para obtener el color del evento basado en la fecha
  const getColorForEvent = (fecha) => {
    const date = new Date(fecha);
    if (isToday(date)) {
      return '#3089E3'; // Azul similar al del panel de control
    } else if (isPast(date)) {
      return '#E33130'; // Gris claro
    } else if (isFuture(date)) {
      return '#30E373'; // Verde claro pastel
    }
  };

  useEffect(() => {
    const obtenerReservas = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('No se encontró un token de acceso');
        }

        const response = await fetch('http://localhost:3001/api/allreservas', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener las reservas');
        }

        const data = await response.json();
        setReservas(data.reservas);
      } catch (error) {
        setError(error.message);
      }
    };

    obtenerReservas();
  }, []);

  // Convertir las reservas en el formato requerido por FullCalendar
  const eventos = reservas ? reservas.map((reserva) => ({
    title: reserva.nombre,
    start: new Date(reserva.fecha),
    end: new Date(reserva.fecha),
    color: getColorForEvent(reserva.fecha)
  })) : [];
  
  return (
    <StyledCalendarContainer elevation={3}>
      <Typography variant="h6" gutterBottom>
        Calendario de Reservas
      </Typography>
      {error ? (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      ) : (
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={eventos}
        height="auto"
        locale="es"
        eventDisplay="block"
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          meridiem: false
        }}
      />

      )}
    </StyledCalendarContainer>
  );
};

export default Calendario;
