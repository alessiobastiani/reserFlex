import React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

const AnticipacionAlert = ({ tiempoAnticipacion, onClose }) => {
  return (
    <div 
      className="anticipacion-alert" 
      style={{ marginBottom: '20px' }} // Ajusta el margen inferior aquí
    >
      <Alert
        severity="info"
        onClose={onClose} // Agrega esta línea para mostrar el botón de cierre
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <AlertTitle>Anticipación Requerida</AlertTitle>
        La reserva debe realizarse con al menos {tiempoAnticipacion} horas de anticipación.
      </Alert>
    </div>
  );
};

export default AnticipacionAlert;
