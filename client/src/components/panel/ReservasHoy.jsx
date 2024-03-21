import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Loading from '../Loading'; // Importa tu componente de carga personalizado

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Argentina/Buenos_Aires');

const ReservasHoy = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3001/api/reservas-hoy', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setReservas(response.data.reservas);
        // Establecer el estado de loading en false después de 500 milisegundos
        setTimeout(() => {
          setLoading(false);
        }, 3000);
      } catch (error) {
        console.error('Error al obtener las reservas de hoy:', error);
      }
    };

    fetchReservas();
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Reservas para hoy</h2>
      {loading ? (
        <Loading /> // Usa tu componente Loading para mostrar la carga
      ) : (
        <Grid container spacing={3}>
          {reservas && reservas.length > 0 ? (
            reservas.map((reserva) => (
              <Grid item xs={12} sm={6} md={4} key={reserva._id}>
                <Card style={{ boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px', backgroundColor: '#fff' }}>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {reserva.nombre}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" style={{ marginTop: '10px' }}>
                      <strong>Fecha:</strong> {dayjs(reserva.fecha).format('YYYY-MM-DD HH:mm')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" style={{ marginTop: '10px' }}>
                      <strong>Teléfono:</strong> {reserva.telefono}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" style={{ marginTop: '10px' }}>
                      <strong>Cantidad de personas:</strong> {reserva.cantidadPersonas}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" style={{ marginTop: '10px' }}>
                      <strong>Tipo de servicio:</strong> {reserva.tipoServicio}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography>No hay reservas para hoy</Typography>
            </Grid>
          )}
        </Grid>
      )}
    </div>
  );
};

export default ReservasHoy;
