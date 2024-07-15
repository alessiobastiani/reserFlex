import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { format } from 'date-fns';

import Title from './Title';

const StyledCard = ({ children }) => (
  <Card style={{ padding: '20px', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', borderRadius: '10px' }}>
    <CardContent>{children}</CardContent>
  </Card>
);

function AllReservations() {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [filterService, setFilterService] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterDay, setFilterDay] = useState('');

  const serviceOptions = ['Cena', 'Almuerzo', 'Merienda', 'Desayuno'];

  const years = Array.from({ length: 6 }, (_, i) => String(new Date().getFullYear() - i));
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1));

  const monthNamesSpanish = {
    '01': 'Enero',
    '02': 'Febrero',
    '03': 'Marzo',
    '04': 'Abril',
    '05': 'Mayo',
    '06': 'Junio',
    '07': 'Julio',
    '08': 'Agosto',
    '09': 'Septiembre',
    '10': 'Octubre',
    '11': 'Noviembre',
    '12': 'Diciembre'
  };

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('No se encontró un token de acceso');
        }

        const response = await fetch('http://localhost:3001/api/allreservas', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener todas las reservas');
        }

        const data = await response.json();
        
        // Ordenar las reservas por fecha de más reciente a más antigua
        const sortedReservations = data.reservas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        setReservations(sortedReservations);
        setFilteredReservations(sortedReservations);
      } catch (error) {
        console.error(error);
      }
    };

    fetchReservations();
  }, []);

  useEffect(() => {
    let filteredData = reservations;

    if (filterService !== '') {
      const lowercaseService = filterService.toLowerCase();
      filteredData = filteredData.filter(reservation => reservation.tipoServicio.toLowerCase() === lowercaseService);
    }

    if (filterYear !== '') {
      filteredData = filteredData.filter(reservation => format(new Date(reservation.fecha), 'yyyy') === filterYear);
    }

    if (filterMonth !== '') {
      filteredData = filteredData.filter(reservation => format(new Date(reservation.fecha), 'MM') === filterMonth);
    }

    if (filterDay !== '') {
      filteredData = filteredData.filter(reservation => format(new Date(reservation.fecha), 'dd') === filterDay);
    }

    setFilteredReservations(filteredData);
  }, [filterService, filterYear, filterMonth, filterDay, reservations]);

  const handleServiceChange = (event) => {
    setFilterService(event.target.value);
  };

  const handleYearChange = (event) => {
    setFilterYear(event.target.value);
  };

  const handleMonthChange = (event) => {
    setFilterMonth(event.target.value);
  };

  const handleDayChange = (event) => {
    setFilterDay(event.target.value);
  };

  return (
    <StyledCard>
      <Typography className='mb-4' variant="h5" component="div">
        Todas las reservas
      </Typography>
      <Typography className='mb-3' variant="h9" component="div">
        Filtrar las reservas
      </Typography>
      <FormControl variant="outlined" style={{ marginBottom: '24px',marginRight: '20px', minWidth: 150 }}>
        <InputLabel id="service-filter-label">Tipo Servicio</InputLabel>
        <Select
          labelId="service-filter-label"
          id="service-filter"
          value={filterService}
          onChange={handleServiceChange}
          label="Tipo de Servicio"
        >
          <MenuItem value="">
            <em>Todos</em>
          </MenuItem>
          {serviceOptions.map(option => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl variant="outlined" style={{ marginBottom: '24px',marginRight: '5px', minWidth: 150 }}>
        <InputLabel id="year-filter-label">Año</InputLabel>
        <Select
          labelId="year-filter-label"
          id="year-filter"
          value={filterYear}
          onChange={handleYearChange}
          label="Año"
        >
          <MenuItem value="">
            <em>Todos</em>
          </MenuItem>
          {years.map(year => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl variant="outlined" style={{ marginBottom: '24px',marginRight: '5px', minWidth: 150 }}>
        <InputLabel id="month-filter-label">Mes</InputLabel>
        <Select
          labelId="month-filter-label"
          id="month-filter"
          value={filterMonth}
          onChange={handleMonthChange}
          label="Mes"
        >
          <MenuItem value="">
            <em>Todos</em>
          </MenuItem>
          {Object.entries(monthNamesSpanish).sort().map(([key, value]) => (
            <MenuItem key={key} value={key}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl variant="outlined" style={{ marginBottom: '24px',marginRight: '5px', minWidth: 150 }}>
        <InputLabel id="day-filter-label">Día</InputLabel>
        <Select
          labelId="day-filter-label"
          id="day-filter"
          value={filterDay}
          onChange={handleDayChange}
          label="Día"
        >
          <MenuItem value="">
            <em>Todos</em>
          </MenuItem>
          {days.map(day => (
            <MenuItem key={day} value={day}>
              {day}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {filteredReservations.length === 0 ? (
        <Typography variant="body2">No hay reservas disponibles.</Typography>
      ) : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Nombre</b></TableCell>
                <TableCell><b>Cantidad de Personas</b></TableCell>
                <TableCell><b>Tipo de Servicio</b></TableCell>
                <TableCell><b>Fecha</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReservations.map((reservation, index) => (
                <TableRow key={index}>
                  <TableCell>{reservation.nombre}</TableCell>
                  <TableCell>{reservation.cantidadPersonas}</TableCell>
                  <TableCell>{reservation.tipoServicio}</TableCell>
                  <TableCell>{new Date(reservation.fecha).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </StyledCard>
  );
}

export default AllReservations;

