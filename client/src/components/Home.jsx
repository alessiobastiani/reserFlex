import React, { useState, useEffect } from 'react';
import ReservaForm from "./ReservaForm";
import dayjs from 'dayjs';
import Navbar1 from './Navbar1';
import CurrentDateTime from './CurrentDateTime';


// Configura la localización en español para Day.js
dayjs.locale('es');

const Home = () => {
  const [ultimaReserva, setUltimaReserva] = useState(null);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const decodedToken = token ? JSON.parse(atob(token.split('.')[1])) : null; 
    const userId = decodedToken ? decodedToken.id : null;
    setUserId(userId);
    
    // Verificar si hay una última reserva en el localStorage
    const storedReserva = localStorage.getItem('ultimaReserva');
    if (storedReserva) {
      setUltimaReserva(JSON.parse(storedReserva));
    }
  }, []);

  useEffect(() => {
    const fetchUltimaReserva = async () => {
      try {
        if (userId) {
          const token = localStorage.getItem('token');
          const response = await fetch(`http://localhost:3001/api/reservas/latest/${userId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('No se pudo obtener la última reserva');
          }

          const data = await response.json();
          if (data.reserva) {
            setUltimaReserva(data.reserva);
            localStorage.setItem('ultimaReserva', JSON.stringify(data.reserva));
          } else {
            setUltimaReserva(null);
            localStorage.removeItem('ultimaReserva');
          }
        }
      } catch (error) {
        console.error('Error al obtener la última reserva:', error);
        setError('No se pudo obtener la última reserva');
      }
    };
    
    fetchUltimaReserva();
  }, [userId]);

  const handleReservaSubmit = async (reservaData) => {
    try {
      // Verificar si la fecha de reserva es válida utilizando Dayjs
      if (!dayjs(reservaData.fecha).isValid()) {
        throw new Error('La fecha de la reserva es inválida');
      }
  
      // Convertir la fecha de reserva a formato ISO
      const fechaISO = dayjs(reservaData.fecha).toISOString();
      reservaData.fecha = fechaISO;
  
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/reservas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(reservaData),
      });
  
      if (!response.ok) {
        throw new Error('No se pudo crear la reserva');
      }
  
      const nuevaReserva = await response.json();
      setUltimaReserva(nuevaReserva); // Actualiza el estado solo si la reserva se crea correctamente
      localStorage.setItem('ultimaReserva', JSON.stringify(nuevaReserva));
    } catch (error) {
      console.error('Error al crear la reserva:', error);
      setError('No se pudo crear la reserva');
    }
  };

  const handleEliminar = async (reservaId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/reservas/${reservaId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('No se pudo eliminar la reserva');
      }
  
      // Eliminar la reserva del estado de reservas
      setUltimaReserva(null);
      localStorage.removeItem('ultimaReserva');
  
    } catch (error) {
      console.error('Error al eliminar la reserva:', error);
      setError('No se pudo eliminar la reserva');
    }
  };
  

  // Manejo de cierre de sesión
  useEffect(() => {
    if (!userId) {
      setUltimaReserva(null);
      localStorage.removeItem('ultimaReserva');
    }
  }, [userId]);

  return (
    <div>
      <Navbar1/>
      <div>
        <h1 className='titulo'>Bienvenido a reserFlex</h1>
      </div>
      <div className="text-aling-center">
      <CurrentDateTime/>
      </div>
      <ReservaForm onReservaSubmit={handleReservaSubmit} />
    </div>
  );
};

export default Home;
