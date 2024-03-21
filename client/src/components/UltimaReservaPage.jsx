import React, { useState, useEffect } from 'react';
import Targeta from './Targeta';

import Navbar1 from './Navbar1';

const UltimaReservaPage = () => {
  const [ultimaReserva, setUltimaReserva] = useState(null);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const decodedToken = token ? JSON.parse(atob(token.split('.')[1])) : null; 
    const userId = decodedToken ? decodedToken.id : null;
    setUserId(userId);

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
          } else {
            setUltimaReserva(null);
          }
        }
      } catch (error) {
        console.error('Error al obtener la última reserva:', error);
        setError('No se pudo obtener la última reserva');
      }
    };
    
    fetchUltimaReserva();
  }, [userId]);

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
  

  return (
    <div>
      <Navbar1 />
      <div>
        {error && <p>Error: {error}</p>}
        {ultimaReserva && <Targeta reserva={ultimaReserva} handleEliminar={handleEliminar} />}
      </div>
    </div>
  );
};

export default UltimaReservaPage;
