import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard'; // Importa el icono Dashboard
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { IconButton } from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

// Función para manejar la descarga del informe de reservas del último mes
const handleDownloadLastMonthReport = async () => {
  try {
    // Obtener el token de autorización del almacenamiento local
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró un token de acceso');
    }

    // Realizar una solicitud al servidor para descargar las reservas del último mes
    const response = await fetch('http://localhost:3001/api/reservas/descargar-reservas-ultimo-mes', {
      headers: {
        Authorization: `Bearer ${token}` // Incluir el token de autorización en el encabezado
      }
    });
    
    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      throw new Error('Error al obtener las reservas del último mes');
    }

    // Obtener el contenido del archivo CSV
    const csvData = await response.text();

    // Crear un objeto Blob a partir del contenido CSV
    const blob = new Blob([csvData], { type: 'text/csv' });

    // Crear un objeto URL para el Blob
    const url = window.URL.createObjectURL(blob);

    // Crear un enlace para descargar el archivo CSV
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'reservas-ultimo-mes.csv');

    // Hacer clic en el enlace para iniciar la descarga del archivo CSV
    document.body.appendChild(link);
    link.click();

    // Limpiar el enlace y liberar el objeto URL
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error('Error al descargar el informe de reservas del último mes:', error);
  }
};

// Función para manejar la descarga del informe de reservas de los últimos 3 meses
const handleDownloadLastThreeMonthsReport = async () => {
  try {
    // Obtener el token de autorización del almacenamiento local
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró un token de acceso');
    }

    // Realizar una solicitud al servidor para descargar las reservas de los últimos 3 meses
    const response = await fetch('http://localhost:3001/api/reservas/reservas-ultimos-tres-meses', {
      headers: {
        Authorization: `Bearer ${token}` // Incluir el token de autorización en el encabezado
      }
    });
    
    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      throw new Error('Error al obtener las reservas de los últimos 3 meses');
    }

    // Obtener el contenido del archivo CSV
    const csvData = await response.text();

    // Crear un objeto Blob a partir del contenido CSV
    const blob = new Blob([csvData], { type: 'text/csv' });

    // Crear un objeto URL para el Blob
    const url = window.URL.createObjectURL(blob);

    // Crear un enlace para descargar el archivo CSV
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'reservas-ultimos-tres-meses.csv');

    // Hacer clic en el enlace para iniciar la descarga del archivo CSV
    document.body.appendChild(link);
    link.click();

    // Limpiar el enlace y liberar el objeto URL
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error('Error al descargar el informe de reservas de los últimos 3 meses:', error);
  }
};

// Función para manejar la descarga del informe de reservas del último año
const handleDownloadLastYearReport = async () => {
  try {
    // Obtener el token de autorización del almacenamiento local
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró un token de acceso');
    }

    // Realizar una solicitud al servidor para descargar las reservas del último año
    const response = await fetch('http://localhost:3001/api/reservas/reservas-ultimo-anio', {
      headers: {
        Authorization: `Bearer ${token}` // Incluir el token de autorización en el encabezado
      }
    });
    
    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      throw new Error('Error al obtener las reservas del último año');
    }

    // Obtener el contenido del archivo CSV
    const csvData = await response.text();

    // Crear un objeto Blob a partir del contenido CSV
    const blob = new Blob([csvData], { type: 'text/csv' });

    // Crear un objeto URL para el Blob
    const url = window.URL.createObjectURL(blob);

    // Crear un enlace para descargar el archivo CSV
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'reservas-ultimo-anio.csv');

    // Hacer clic en el enlace para iniciar la descarga del archivo CSV
    document.body.appendChild(link);
    link.click();

    // Limpiar el enlace y liberar el objeto URL
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error('Error al descargar el informe de reservas del último año:', error);
  }
};

// Definir los elementos de la lista principal
export const mainListItems = (
  <div>
    <ListItem button>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <ShoppingCartIcon />
      </ListItemIcon>
      <ListItemText primary="Reservas de hoy" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Calendario" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Clientes" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <LayersIcon />
      </ListItemIcon>
      <ListItemText primary="Cerrar sesión" />
    </ListItem>
  </div>
);

// Definir los elementos de la lista secundaria
export const secondaryListItems = (
  <div>
    {/* Título para la sección de informes guardados */}
    <ListSubheader inset>Descargar informes</ListSubheader>
  
    {/* Botones para descargar los informes */}
    <ListItem button onClick={handleDownloadLastMonthReport}>
      <ListItemIcon>
        <CloudDownloadIcon />
      </ListItemIcon>
      <ListItemText primary="Último mes" />
    </ListItem>
    <ListItem button onClick={handleDownloadLastThreeMonthsReport}>
      <ListItemIcon>
        <CloudDownloadIcon />
      </ListItemIcon>
      <ListItemText primary="Últimos 3 meses" />
    </ListItem>
    <ListItem button onClick={handleDownloadLastYearReport}>
      <ListItemIcon>
        <CloudDownloadIcon />
      </ListItemIcon>
      <ListItemText primary="Último año" />
    </ListItem>
  </div>
);
