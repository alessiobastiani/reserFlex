import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import { FormControl, Select, MenuItem } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditarReserva = () => {
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró un token de acceso');
        }

        const response = await fetch('http://localhost:3001/api/reservas/allReservas', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener las reservas');
        }

        const data = await response.json();
        const reservasOrdenadas = data.reservas.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setReservas(reservasOrdenadas);
      } catch (error) {
        console.error(error);
        toast.error('Error al obtener las reservas');
      }
    };

    fetchReservas();
  }, []);

  const handleEdit = (id, field, newValue) => {
    const newReservas = reservas.map((reserva) =>
      reserva._id === id ? { ...reserva, [field]: newValue } : reserva
    );
    setReservas(newReservas);
  };

  const handleSave = async (id) => {
    try {
      const reservaToUpdate = reservas.find((reserva) => reserva._id === id);

      if (!reservaToUpdate) {
        toast.error('Reserva no encontrada');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró un token de acceso');
      }

      const response = await fetch(`http://localhost:3001/api/reservas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reservaToUpdate),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la reserva');
      }

      toast.success('¡Edición exitosa!');
    } catch (error) {
      console.error(error);
      toast.error('Error al actualizar la reserva');
    }
  };

  const handleEliminar = async (reservaId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/reservas/${reservaId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('No se pudo eliminar la reserva');
      }

      // Actualizar el estado después de eliminar
      setReservas((prevReservas) => prevReservas.filter((reserva) => reserva._id !== reservaId));
      toast.success('Reserva eliminada correctamente');
    } catch (error) {
      console.error('Error al eliminar la reserva:', error);
      toast.error('Error al eliminar la reserva');
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const reservasFiltradas = reservas.filter((reserva) => new Date(reserva.fecha) >= new Date());

  return (
    <React.Fragment>
      <Title>Todas las reservas</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell><b>Fecha</b></TableCell>
            <TableCell><b>Nombre</b></TableCell>
            <TableCell><b>Teléfono</b></TableCell>
            <TableCell><b>Cantidad de Personas</b></TableCell>
            <TableCell><b>Tipo de Servicio</b></TableCell>
            <TableCell><b>Acción</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reservasFiltradas.map((reserva) => (
            <TableRow key={reserva._id}>
              <TableCell>
                <TextField
                  type="datetime-local"
                  value={formatDate(reserva.fecha)}
                  onChange={(e) => handleEdit(reserva._id, 'fecha', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  value={reserva.nombre}
                  onChange={(e) => handleEdit(reserva._id, 'nombre', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  value={reserva.telefono}
                  onChange={(e) => handleEdit(reserva._id, 'telefono', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  value={reserva.cantidadPersonas}
                  onChange={(e) => handleEdit(reserva._id, 'cantidadPersonas', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <FormControl fullWidth>
                  <Select
                    value={reserva.tipoServicio}
                    onChange={(e) => handleEdit(reserva._id, 'tipoServicio', e.target.value)}
                  >
                    <MenuItem value="Desayuno">Desayuno</MenuItem>
                    <MenuItem value="Almuerzo">Almuerzo</MenuItem>
                    <MenuItem value="Merienda">Merienda</MenuItem>
                    <MenuItem value="Cena">Cena</MenuItem>
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                  <Button onClick={() => handleSave(reserva._id)} variant="outlined" color="primary">
                    Guardar
                  </Button>
                  <Button
                    onClick={() => handleEliminar(reserva._id)}
                    variant="outlined"
                    color="secondary"
                  >
                    Eliminar
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ToastContainer />
    </React.Fragment>
  );
};

export default EditarReserva;
