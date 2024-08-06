import React from 'react';
import { Card, CardContent, Typography, Button, Box, CardMedia } from '@mui/material';
import dayjs from 'dayjs';
import reserva2 from '../assets/ultima.png';

const Targeta = ({ reserva, handleCancelarReserva }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      sx={{ padding: 1 }}
    >
      <Card
        sx={{
          maxWidth: 350,
          width: '100%',
          margin: 'auto',
          borderRadius: 2,
          boxShadow: 3,
        }}
        variant="outlined"
      >
        <CardMedia
          component="img"
          height="200"
          image={reserva2}
          alt="Imagen de la reserva"
        />
        <CardContent sx={{ textAlign: 'center' }}>
          <Typography variant="h5" component="h2" sx={{ color: '#007bff', mb: 3 }}>
            Última Reserva
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Nombre:</strong> {reserva.nombre}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Teléfono:</strong> {reserva.telefono}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Fecha:</strong> {dayjs(reserva.fecha).format('DD/MM/YYYY')}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Cantidad de Personas:</strong> {reserva.cantidadPersonas}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Tipo de Servicio:</strong> {reserva.tipoServicio}
          </Typography>
          <Button
            onClick={handleCancelarReserva}
            variant="contained"
            color="secondary"
            sx={{ mt: 3, display: 'block', mx: 'auto' }}
          >
            Cancelar Reserva
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Targeta;
