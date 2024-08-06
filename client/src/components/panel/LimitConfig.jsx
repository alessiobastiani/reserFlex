import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

export default function LimitConfig() {
  const [limit, setLimit] = useState(0);
  const [leadTime, setLeadTime] = useState(0);
  const [horarios, setHorarios] = useState({
    desayuno: { inicio: '', fin: '' },
    merienda: { inicio: '', fin: '' },
    almuerzo: { inicio: '', fin: '' },
    cena: { inicio: '', fin: '' }
  });
  const [closedDates, setClosedDates] = useState([]);

  useEffect(() => {
    const fetchConfiguracion = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró un token de acceso');
        }

        const response = await fetch('http://localhost:3001/configuracion', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener la configuración');
        }

        const data = await response.json();
        setLimit(data.limiteReservasPorDia);
        setLeadTime(data.tiempoAnticipacionReservas);
        setHorarios(data.horarios);

        const closedDatesResponse = await fetch('http://localhost:3001/configuracion/fechasCerradas', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!closedDatesResponse.ok) {
          throw new Error('Error al obtener las fechas cerradas');
        }

        const closedDatesData = await closedDatesResponse.json();
        setClosedDates(closedDatesData.fechasCerradas || []);
      } catch (error) {
        console.error('Error:', error.message);
        toast.error('Error al obtener la configuración');
      }
    };

    fetchConfiguracion();
  }, []);

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handleLeadTimeChange = (event) => {
    setLeadTime(event.target.value);
  };

  const handleHorarioChange = (event, key, tipo) => {
    const value = event.target.value;
    setHorarios(prevHorarios => ({
      ...prevHorarios,
      [key]: {
        ...prevHorarios[key],
        [tipo]: value
      }
    }));
  };

  const handleClosedDateChange = (newDate) => {
    if (newDate) {
      setClosedDates(prevDates => [...prevDates, newDate.toISOString().split('T')[0]]);
    }
  };

  const handleRemoveDate = async (date) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró un token de acceso');
      }

      const response = await fetch(`http://localhost:3001/configuracion/fechasCerradas/${date}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la fecha cerrada');
      }

      setClosedDates(prevDates => prevDates.filter(d => d !== date));
      toast.success('Fecha cerrada eliminada correctamente');
    } catch (error) {
      console.error('Error:', error.message);
      toast.error('Error al eliminar la fecha cerrada');
    }
  };

  const handleConfigSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró un token de acceso');
      }

      const response = await fetch('http://localhost:3001/configuracion', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          limiteReservasPorDia: limit,
          tiempoAnticipacionReservas: leadTime,
          horarios,
          fechasCerradas: closedDates
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la configuración');
      }

      toast.success('Configuración actualizada correctamente');
    } catch (error) {
      console.error('Error:', error.message);
      toast.error('Error al actualizar la configuración');
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>Configuración de Reservas</Typography>
      <TextField
        label="Límite de reservas por día"
        type="number"
        value={limit}
        onChange={handleLimitChange}
        sx={{ marginBottom: 2, width: '100%' }}
      />
      <TextField
        label="Tiempo de anticipación (en horas)"
        type="number"
        value={leadTime}
        onChange={handleLeadTimeChange}
        sx={{ marginBottom: 2, width: '100%' }}
      />
      {Object.keys(horarios).map((key) => (
        <Box key={key} sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
          <TextField
            label={`Inicio ${key.charAt(0).toUpperCase() + key.slice(1)}`}
            type="time"
            value={horarios[key].inicio}
            onChange={(event) => handleHorarioChange(event, key, 'inicio')}
            sx={{ flex: 1 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label={`Fin ${key.charAt(0).toUpperCase() + key.slice(1)}`}
            type="time"
            value={horarios[key].fin}
            onChange={(event) => handleHorarioChange(event, key, 'fin')}
            sx={{ flex: 1 }}
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      ))}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Seleccionar fecha cerrada"
          value={null}
          onChange={handleClosedDateChange}
          renderInput={(params) => <TextField {...params} sx={{ marginBottom: 2, width: '100%' }} />}
        />
      </LocalizationProvider>
      <Box sx={{ marginTop: 2, padding: 2, border: '1px solid #ccc', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>Fechas Cerradas</Typography>
        {closedDates.length > 0 ? (
          <Box>
            {closedDates.map((date, index) => (
              <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
                <Typography>{dayjs(date).format('YYYY-MM-DD')}</Typography>
                <Button onClick={() => handleRemoveDate(date)} color="error" variant="outlined" size="small">
                  Eliminar
                </Button>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography>No hay fechas cerradas.</Typography>
        )}
      </Box>
      <Button onClick={handleConfigSubmit} variant="contained" color="primary" sx={{ width: '100%', marginTop: 2 }}>
        Guardar configuración
      </Button>
      <ToastContainer />
    </Box>
  );
}
