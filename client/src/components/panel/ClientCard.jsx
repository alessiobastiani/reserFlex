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

const ClientCard = () => {
  const [clients, setClients] = useState([]);
  const [token, setToken] = useState(null); // Inicializa token como null

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const storedToken = localStorage.getItem('token'); // Obtener el token de localStorage
        // Verificar si hay un token disponible
        if (!storedToken) {
          throw new Error('No se encontró un token de acceso');
        }
        setToken(storedToken); // Actualiza el estado de token con el valor obtenido de localStorage
        // Aquí realiza la solicitud para obtener los datos de los clientes desde tu API
        const response = await fetch('http://localhost:3001/api/auth/users', {
          headers: {
            Authorization: `Bearer ${storedToken}` // Agrega el token a los encabezados de la solicitud
          }
        });
        const data = await response.json();
        setClients(data);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    fetchClients();
  }, []);

  return (
    <Card style={{ padding: '20px', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', borderRadius: '10px' }}>
      <CardContent >
        <Typography className='mb-4' variant="h5" component="div">
          Lista de Clientes
        </Typography>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Nombre</b></TableCell>
                <TableCell><b>Teléfono</b></TableCell>
                <TableCell><b>Email</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clients.map((client, index) => (
                <TableRow key={index}>
                  <TableCell>{client.username}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>{client.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </CardContent>
    </Card>
  );
};

export default ClientCard;
