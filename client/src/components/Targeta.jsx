import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import dayjs from 'dayjs';
import Navbar1 from './Navbar1';

const Targeta = ({ reserva, handleEliminar }) => {
  return (
    <div>
    <Card className='targetiña' variant="outlined" style={{ backgroundColor: '#f0f0f0' }}>
      <CardContent>
        <Typography variant="h5" component="h2" style={{ color: '#007bff', marginBottom: '10px' }}>
          Última Reserva
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          <strong>Nombre:</strong> {reserva.nombre}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          <strong>Teléfono:</strong> {reserva.telefono}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          <strong>Fecha:</strong> {dayjs(reserva.fecha).format('DD/MM/YYYY')}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          <strong>Cantidad de Personas:</strong> {reserva.cantidadPersonas}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          <strong>Tipo de Servicio:</strong> {reserva.tipoServicio}
        </Typography>
        <Button onClick={() => handleEliminar(reserva._id)} variant="outlined" style={{ color: '#ff0000', borderColor: '#ff0000', marginTop: '10px' }}>
          Eliminar Reserva
        </Button>
      </CardContent>
    </Card>
    </div>
  );
};

export default Targeta;
