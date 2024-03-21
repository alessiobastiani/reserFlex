import React, { useState, useEffect } from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';

function Deposits() {
  const [totalReservas, setTotalReservas] = useState(null);

  useEffect(() => {
    const fetchTotalReservas = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró un token de acceso');
        }

        const response = await fetch('http://localhost:3001/api/cantidad-reservas', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener la cantidad total de reservas');
        }

        const data = await response.json();
        setTotalReservas(data.totalReservas);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTotalReservas();
  }, []);

  return (
    <React.Fragment>
      <Title>Total de Reservas</Title>
      <Typography className='mt-3' component="p" variant="h3">
        {totalReservas !== null ? `${totalReservas}` : 'Cargando...'}
      </Typography>
      <Typography className='mt-3' color="text.secondary" sx={{ flex: 1 }}>
        {totalReservas !== null ? 'Actualizado automáticamente' : ''}
      </Typography>
      <div>
        <Link color="primary">
          reserFlex
        </Link>
      </div>
    </React.Fragment>
  );
}

export default Deposits;
