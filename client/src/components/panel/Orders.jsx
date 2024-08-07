import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token'); // Obtener el token de localStorage

        // Verificar si hay un token disponible
        if (!token) {
          throw new Error('No se encontró un token de acceso');
        }

        const response = await fetch('http://localhost:3001/api/reservas/latests', {
          headers: {
            Authorization: `Bearer ${token}` // Agregar el token al encabezado de la solicitud
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener las últimas reservas');
        }

        const data = await response.json();
        setOrders(data.reservas);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchOrders();
  }, []);

  return (
    <React.Fragment>
      <Title>Recientes reservas</Title>
      {error ? (
        <div>Error: {error}</div>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><b>Fecha</b></TableCell>
              <TableCell><b>Nombre</b></TableCell>
              <TableCell><b>Teléfono</b></TableCell>
              <TableCell><b>Cantidad de Personas</b></TableCell>
              <TableCell><b>Tipo de Servicio</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}> {/* Usa _id directamente si es único */}
                <TableCell>{new Date(order.fecha).toLocaleDateString()}</TableCell>
                <TableCell>{order.nombre}</TableCell>
                <TableCell>{order.telefono}</TableCell>
                <TableCell>{order.cantidadPersonas}</TableCell>
                <TableCell>{order.tipoServicio}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <div className='mt-3'>
        Estas son las personas que reservaron en el último tiempo.
      </div>
    </React.Fragment>
  );
}

export default Orders;
