import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';

const NotificationsPanel = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró un token de acceso');
        }
    
        const response = await fetch('http://localhost:3001/api/notifications', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
    
        if (!response.ok) {
          throw new Error('Error al obtener notificaciones');
        }
    
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error('Error al obtener notificaciones:', error);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    if (!notificationId) {
      console.error('Notification ID is missing');
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró un token de acceso');
      }
  
      const response = await fetch(`http://localhost:3001/api/notifications/${notificationId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
  
      if (!response.ok) {
        throw new Error('No se pudo marcar la notificación como leída');
      }
  
      const updatedData = await response.json();
      const { reserva } = updatedData;
  
      if (!reserva || !reserva._id) {
        console.warn('Reserva no disponible en la respuesta', updatedData);
        // Update the UI to mark notification as read without updating reservation status
        setNotifications(notifications.map((notification) =>
          notification._id === notificationId ? { ...notification, leida: true } : notification
        ));
        return;
      }
  
      // Update the UI to mark notification as read
      setNotifications(notifications.map((notification) =>
        notification._id === notificationId ? { ...notification, leida: true } : notification
      ));
  
      // Update the reservation status
      updateUserReservationStatus(reserva._id, 'cancelada');
  
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
    }
  };
  
  
  const updateUserReservationStatus = async (reservaId, newStatus) => {
    if (!reservaId) {
      console.error('Reserva ID is missing');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró un token de acceso');
      }
  
      const response = await fetch(`http://localhost:3001/api/reservas/${reservaId}/updateStatus`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estado: newStatus }),
      });
  
      if (!response.ok) {
        throw new Error('No se pudo actualizar el estado de la reserva');
      }
  
      console.log(`Reserva ${reservaId} actualizada a ${newStatus}`);
    } catch (error) {
      console.error('Error al actualizar el estado de la reserva:', error);
    }
  };
  
  return (
    <div>
      <h2>Notificaciones</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><b>Mensaje</b></TableCell>
            <TableCell><b>Acción</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {notifications.map((notification) => (
            notification ? (
              <TableRow key={notification._id}>
                <TableCell>{notification.message}</TableCell>
                <TableCell>
                  {!notification.leida && (
                    <Button onClick={() => handleMarkAsRead(notification._id)} variant="outlined" color="primary">
                      Marcar como leída
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ) : null
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default NotificationsPanel;
