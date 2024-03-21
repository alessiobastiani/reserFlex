import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import Button from '@mui/material/Button';
import { DatePicker, TimePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

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
        setReservas(data.reservas);
      } catch (error) {
        console.error(error);
      }
    };

    fetchReservas();
  }, []);

  const handleEdit = (index, newValue, field) => {
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

      // Handle success
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

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
          {reservas.map((reserva, index) => (
            <TableRow key={reserva._id}>
              <TableCell>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Fecha"
                    value={new Date(reserva.fecha)}
                    onChange={(newValue) => handleEdit(index, newValue, 'fecha')}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <TimePicker
                    label="Hora"
                    value={new Date(reserva.fecha)}
                    onChange={(newValue) => handleEdit(index, newValue, 'fecha')}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </TableCell>
              <TableCell contentEditable onBlur={(e) => handleEdit(index, e.target.innerText, 'nombre')}>{reserva.nombre}</TableCell>
              <TableCell contentEditable onBlur={(e) => handleEdit(index, e.target.innerText, 'telefono')}>{reserva.telefono}</TableCell>
              <TableCell contentEditable onBlur={(e) => handleEdit(index, e.target.innerText, 'cantidadPersonas')}>{reserva.cantidadPersonas}</TableCell>
              <TableCell contentEditable onBlur={(e) => handleEdit(index, e.target.innerText, 'tipoServicio')}>{reserva.tipoServicio}</TableCell>
              <TableCell>
                <Button onClick={() => handleSave(reserva._id)} variant="outlined" color="primary">Guardar</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
};

export default EditarReserva;
