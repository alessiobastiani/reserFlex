import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
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
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener las reservas');
        }

        const data = await response.json();
        // Ordenar las reservas de más nuevas a más viejas según la fecha de creación
        const reservasOrdenadas = data.reservas.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setReservas(reservasOrdenadas);
      } catch (error) {
        console.error(error);
      }
    };

    fetchReservas();
  }, []);

  const handleEdit = (index, field, newValue) => {
    const newReservas = [...reservas];
    newReservas[index][field] = newValue;
    setReservas(newReservas);
  };

  const handleSave = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró un token de acceso');
      }

      const reservaToUpdate = reservas.find(reserva => reserva._id === id);

      const response = await fetch(`http://localhost:3001/api/reservas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(reservaToUpdate)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la reserva');
      }

      toast.success('¡Edición exitosa!');
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  // Filtrar las reservas para mostrar solo las que aún no han pasado su fecha
  const reservasFiltradas = reservas.filter(reserva => new Date(reserva.fecha) >= new Date());

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
          {reservasFiltradas.map((reserva, index) => (
            <TableRow key={reserva._id}>
              <TableCell>
                <TextField
                  type="datetime-local"
                  value={reserva.fecha}
                  onChange={(e) => handleEdit(index, 'fecha', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  value={reserva.nombre}
                  onChange={(e) => handleEdit(index, 'nombre', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  value={reserva.telefono}
                  onChange={(e) => handleEdit(index, 'telefono', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  value={reserva.cantidadPersonas}
                  onChange={(e) => handleEdit(index, 'cantidadPersonas', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <FormControl fullWidth>
                  <Select
                    value={reserva.tipoServicio}
                    onChange={(e) => handleEdit(index, 'tipoServicio', e.target.value)}
                  >
                    <MenuItem value="Desayuno">Desayuno</MenuItem>
                    <MenuItem value="Almuerzo">Almuerzo</MenuItem>
                    <MenuItem value="Merienda">Merienda</MenuItem>
                    <MenuItem value="Cena">Cena</MenuItem>
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell>
                <Button onClick={() => handleSave(reserva._id)} variant="outlined" color="primary">Guardar</Button>
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
