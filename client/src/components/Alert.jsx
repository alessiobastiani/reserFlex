import React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

const AnticipacionAlert = ({ tiempoAnticipacion, onClose }) => {
  return (
    <div className="anticipacion-alert">
        <Alert severity="info" onClose={onClose}>
          <AlertTitle>Anticipación Requerida</AlertTitle>
          La reserva debe realizarse con al menos {tiempoAnticipacion} horas de anticipación.
        </Alert>
    </div>
  );
};

export default AnticipacionAlert;
