import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LimitConfig() {
  const [limit, setLimit] = useState(0);
  const [leadTime, setLeadTime] = useState(0); // Nuevo estado para el tiempo de anticipación
  const [horarios, setHorarios] = useState({
    desayuno: { inicio: '', fin: '' },
    merienda: { inicio: '', fin: '' },
    almuerzo: { inicio: '', fin: '' },
    cena: { inicio: '', fin: '' }
  });
  
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
        setHorarios(data.horarios); // Actualiza horarios desde la respuesta
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
        body: JSON.stringify({ limiteReservasPorDia: limit, tiempoAnticipacionReservas: leadTime, horarios }), // Asegúrate de que 'horarios' sea un objeto anidado
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
    <Box sx={{ maxWidth: 400, margin: 'auto', textAlign: 'center' }}>
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
    <TextField
      label="Inicio Desayuno"
      type="time"
      value={horarios.desayuno.inicio}
      onChange={(event) => handleHorarioChange(event, 'desayuno', 'inicio')}
      sx={{ marginBottom: 2, width: '45%', marginRight: '5%' }}
      InputLabelProps={{
        shrink: true,
      }}
    />
    <TextField
      label="Fin Desayuno"
      type="time"
      value={horarios.desayuno.fin}
      onChange={(event) => handleHorarioChange(event, 'desayuno', 'fin')}
      sx={{ marginBottom: 2, width: '45%' }}
      InputLabelProps={{
        shrink: true,
      }}
    />
        <TextField
      label="Inicio Almuerzo"
      type="time"
      value={horarios.almuerzo.inicio}
      onChange={(event) => handleHorarioChange(event, 'almuerzo', 'inicio')}
      sx={{ marginBottom: 2, width: '45%', marginRight: '5%' }}
      InputLabelProps={{
        shrink: true,
      }}
    />
    <TextField
      label="Fin Almuerzo"
      type="time"
      value={horarios.almuerzo.fin}
      onChange={(event) => handleHorarioChange(event, 'almuerzo', 'fin')}
      sx={{ marginBottom: 2, width: '45%' }}
      InputLabelProps={{
        shrink: true,
      }}
    />
    <TextField
      label="Inicio Merienda"
      type="time"
      value={horarios.merienda.inicio}
      onChange={(event) => handleHorarioChange(event, 'merienda', 'inicio')}
      sx={{ marginBottom: 2, width: '45%', marginRight: '5%' }}
      InputLabelProps={{
        shrink: true,
      }}
    />
    <TextField
      label="Fin Merienda"
      type="time"
      value={horarios.merienda.fin}
      onChange={(event) => handleHorarioChange(event, 'merienda', 'fin')}
      sx={{ marginBottom: 2, width: '45%' }}
      InputLabelProps={{
        shrink: true,
      }}
    />
    <TextField
      label="Inicio Cena"
      type="time"
      value={horarios.cena.inicio}
      onChange={(event) => handleHorarioChange(event, 'cena', 'inicio')}
      sx={{ marginBottom: 2, width: '45%', marginRight: '5%' }}
      InputLabelProps={{
        shrink: true,
      }}
    />
    <TextField
      label="Fin Cena"
      type="time"
      value={horarios.cena.fin}
      onChange={(event) => handleHorarioChange(event, 'cena', 'fin')}
      sx={{ marginBottom: 2, width: '45%' }}
      InputLabelProps={{
        shrink: true,
      }}
    />
    <Button onClick={handleConfigSubmit} variant="contained" color="primary" sx={{ width: '100%' }}>
      Guardar configuración
    </Button>
    <ToastContainer />
  </Box>
  );
}