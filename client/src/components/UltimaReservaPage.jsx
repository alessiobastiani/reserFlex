import React, { useState, useEffect } from 'react';
import Targeta from './Targeta';
import Navbar1 from './Navbar1';
import { ThemeProvider, createTheme, CssBaseline, Box, Typography, Button, Card, CardContent } from '@mui/material';
import { getLPTheme } from './themeConfig';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UltimaReservaPage = () => {
  const [ultimaReserva, setUltimaReserva] = useState(null);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [mode, setMode] = useState('light');
  const [estadoReserva, setEstadoReserva] = useState(''); // Estado de la reserva

  const theme = createTheme(getLPTheme(mode));

  const toggleColorMode = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

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
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('No se pudo obtener la última reserva');
          }

          const data = await response.json();
          if (data.reserva) {
            setUltimaReserva(data.reserva);
            setEstadoReserva(data.reserva.estado);
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

  useEffect(() => {
    // Este efecto se ejecuta cada vez que cambia el estado de la reserva
    console.log('Estado de reserva actualizado:', estadoReserva);
    // Aquí puedes realizar cualquier acción adicional que necesites
  }, [estadoReserva]);

  const handleCancelarReserva = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/reservas/${ultimaReserva._id}/cancel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estado: 'pendiente_cancelacion' }),
      });

      if (!response.ok) {
        throw new Error('No se pudo cancelar la reserva');
      }

      setEstadoReserva('pendiente_cancelacion');
      toast.success('Reserva marcada como pendiente de cancelación. El administrador será notificado.');
    } catch (error) {
      console.error('Error al cancelar la reserva:', error);
      setError('No se pudo cancelar la reserva');
    }
  };

  const handleVolverInicio = () => {
    // Lógica para volver al inicio
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar1 mode={mode} toggleColorMode={toggleColorMode} />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        p={3}
      >
        {error && <p>Error: {error}</p>}
        {ultimaReserva ? (
          <>
            {estadoReserva === 'pendiente_cancelacion' ? (
              <Card sx={{ maxWidth: 600, width: '100%', p: 2, boxShadow: 3, mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" align="center" paragraph>
                    La cancelación de la reserva está pendiente. El administrador la cancelará, puede volver a realizar otra reserva. Si necesita, puede ponerse en contacto con nosotros.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleVolverInicio}
                    sx={{ display: 'block', mx: 'auto' }}
                  >
                    Volver al inicio
                  </Button>
                </CardContent>
              </Card>
            ) : estadoReserva === 'cancelada' ? (
              <Card sx={{ maxWidth: 600, width: '100%', p: 2, boxShadow: 3, mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" align="center" paragraph>
                    La reserva ha sido cancelada.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleVolverInicio}
                    sx={{ display: 'block', mx: 'auto' }}
                  >
                    Volver al inicio
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Targeta reserva={ultimaReserva} handleCancelarReserva={handleCancelarReserva} />
            )}
          </>
        ) : null}
      </Box>
      <ToastContainer />
    </ThemeProvider>
  );
};

export default UltimaReservaPage;
