import React, { useState, useEffect } from 'react';
import { CssBaseline, Box, createTheme, ThemeProvider } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import ReservaForm from './ReservaForm';
import Navbar1 from './Navbar1';
import CurrentDateTime from './CurrentDateTime';
import Footer from './Footer1';


dayjs.locale('es');

const getLPTheme = (mode) => ({
  palette: {
    mode,
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
  typography: {
    h1: { fontSize: '2.5rem', margin: '20px 0' },
    body1: { fontSize: '1.2rem', margin: '10px 0' },
  },
});

const ToggleCustomTheme = ({ showCustomTheme, toggleCustomTheme }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100vw',
      position: 'fixed',
      bottom: 24,
    }}
  >
  </Box>
);

const Home = () => {
  const [mode, setMode] = useState('light');
  const [showCustomTheme, setShowCustomTheme] = useState(false); // Cambiado a false para usar solo Material Design
  const [ultimaReserva, setUltimaReserva] = useState(null);
  const [userId, setUserId] = useState(null);

  const LPtheme = createTheme(getLPTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });

  const toggleColorMode = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleCustomTheme = () => {
    setShowCustomTheme((prev) => !prev);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const decodedToken = token ? JSON.parse(atob(token.split('.')[1])) : null;
    const userId = decodedToken ? decodedToken.id : null;
    setUserId(userId);

    const storedReserva = localStorage.getItem('ultimaReserva');
    if (storedReserva) {
      setUltimaReserva(JSON.parse(storedReserva));
    }
  }, []);

  useEffect(() => {
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
            localStorage.setItem('ultimaReserva', JSON.stringify(data.reserva));
          } else {
            setUltimaReserva(null);
            localStorage.removeItem('ultimaReserva');
          }
        }
      } catch (error) {
        console.error('Error al obtener la última reserva:', error);
        toast.error('No se pudo obtener la última reserva', {
          className: 'custom-toast',
          bodyClassName: 'custom-toast-body',
          progressClassName: 'custom-toast-progress',
        });
      }
    };

    fetchUltimaReserva();
  }, [userId]);

  const handleReservaSubmit = async (reservaData) => {
    try {
      if (!dayjs(reservaData.fecha).isValid()) {
        throw new Error('La fecha de la reserva es inválida');
      }

      const fechaISO = dayjs(reservaData.fecha).toISOString();
      reservaData.fecha = fechaISO;

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/reservas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(reservaData),
      });

      if (!response.ok) {
        const responseData = await response.json();
        if (responseData.message === 'Límite de reservas alcanzado') {
          throw new Error('Límite de reservas alcanzado');
        }
        if (responseData.message === 'No se pueden hacer reservas para fechas pasadas') {
          throw new Error('No se pueden hacer reservas para fechas pasadas');
        }
        if (responseData.message === 'No se pueden hacer reservas más de un año en adelante') {
          throw new Error('No se pueden hacer reservas más de un año en adelante');
        }
        if (responseData.message.includes('anticipación')) {
          throw new Error(responseData.message);
        }
        throw new Error('No se pudo crear la reserva');
      }

      return response;
    } catch (error) {
      console.error('Error al crear la reserva:', error);
      toast.error(error.message);
      throw error;
    }
  };

  return (
    <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
      <CssBaseline />
      <Navbar1 mode={mode} toggleColorMode={toggleColorMode} />
      <Box sx={{ bgcolor: 'background.default', textAlign: 'center', marginTop: '60px' }}>
        <CurrentDateTime />
        <ReservaForm onReservaSubmit={handleReservaSubmit} />
        <Footer />
      </Box>
      <ToggleCustomTheme
        showCustomTheme={showCustomTheme}
        toggleCustomTheme={toggleCustomTheme}
      />
    </ThemeProvider>
  );
};

ToggleCustomTheme.propTypes = {
  showCustomTheme: PropTypes.bool.isRequired,
  toggleCustomTheme: PropTypes.func.isRequired,
};

export default Home;
