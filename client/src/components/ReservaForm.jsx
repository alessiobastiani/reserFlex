import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import { Button, Card } from 'react-bootstrap';
import reserva from "../assets/reservado.png";
import { PDFDownloadLink, Document, Page, Text, StyleSheet, View, Image } from '@react-pdf/renderer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from './Loading';
import { CheckCircle, ErrorOutline } from '@mui/icons-material';
import reservaImg from "../assets/reserva.jpg"; // Importar la imagen local
import AnticipacionAlert from './Alert';
import { ThemeProvider, createTheme } from '@mui/material/styles'; // Importa ThemeProvider y createTheme
import getLPTheme from './GetLPTheme';

const theme = createTheme(getLPTheme('light')); // Puedes ajustar el modo según tus necesidades ('light' o 'dark')

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    padding: 0,
    margin: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  card: {
    backgroundColor: '#000', // Fondo negro
    padding: 20,
    width: '100%', // Ancho de la tarjeta
    height: '100%', // Altura automática
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: '5px solid #00BFFF', // Borde celeste
    borderRadius: 10,
    boxShadow: '0 4px 12px rgba(0, 191, 255, 0.5)', // Sombra celeste
  },
  image: {
    width: '100%',
    height: 'auto',
    marginBottom: 20,
    borderRadius: 5, // Redondear bordes de la imagen
  },
  title: {
    fontSize: 24, // Tamaño de fuente más grande
    color: '#00BFFF', // Color de texto celeste
    textAlign: 'center',
    marginBottom: 20,
    textTransform: 'uppercase', // Texto en mayúsculas
    letterSpacing: 1, // Espaciado entre letras
  },
  text: {
    fontSize: 14, // Tamaño de fuente aumentado
    color: '#fff', // Color de texto blanco
    marginBottom: 10,
    textAlign: 'center',
    lineHeight: 1.5, // Altura de línea
  },
  separator: {
    borderBottom: '1px solid #00BFFF', // Separador celeste
    marginBottom: 10,
    width: '100%',
  },
});

const ReservaPDF = ({ reserva }) => (
  <Document>
    <Page size="A6" style={styles.page}>
      <View style={styles.card}>
        <Image style={styles.image} src={reservaImg} />
        <Text style={styles.title}>Reserva exitosa</Text>
        <Text style={styles.text}><Text style={{ fontWeight: 'bold' }}>Nombre:</Text> {reserva.nombre}</Text>
        <View style={styles.separator} />
        <Text style={styles.text}><Text style={{ fontWeight: 'bold' }}>Fecha y Hora:</Text> {dayjs(reserva.fecha).format('DD/MM/YYYY HH:mm')}</Text>
        <View style={styles.separator} />
        <Text style={styles.text}><Text style={{ fontWeight: 'bold' }}>Cantidad de Personas:</Text> {reserva.cantidadPersonas}</Text>
        <View style={styles.separator} />
        <Text style={styles.text}><Text style={{ fontWeight: 'bold' }}>Tipo de Servicio:</Text> {reserva.tipoServicio}</Text>
      </View>
    </Page>
  </Document>
);

const ReservaForm = ({ onReservaSubmit }) => {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fecha, setFecha] = useState(null);
  const [cantidadPersonas, setCantidadPersonas] = useState('');
  const [tipoServicio, setTipoServicio] = useState('');
  const [error, setError] = useState(null);
  const [reservaGuardada, setReservaGuardada] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tiempoAnticipacion, setTiempoAnticipacion] = useState(null);
  const [horarios, setHorarios] = useState({});
  const [fechasCerradas, setFechasCerradas] = useState([]); // Estado para las fechas cerradas
  const [showAlert, setShowAlert] = useState(true); // Agregar el estado showAlert

  useEffect(() => {
    const fetchFechasCerradas = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró un token de acceso');
        }

        const response = await fetch('http://localhost:3001/configuracion/fechasCerradas', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener las fechas cerradas');
        }

        const data = await response.json();
        setFechasCerradas(data.fechasCerradas);
      } catch (error) {
        console.error('Error al obtener las fechas cerradas:', error);
        toast.error('Error al obtener las fechas cerradas');
      }
    };

    fetchFechasCerradas();
  }, []);

  useEffect(() => {
    const fetchLimiteReservas = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró un token de acceso');
        }

        const response = await fetch('http://localhost:3001/configuracion', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener el límite de reservas');
        }

        const data = await response.json();
        // Aquí podrías manejar la respuesta para validar el límite de reservas si es necesario
      } catch (error) {
        console.error('Error al obtener el límite de reservas:', error);
        toast.error('Error al obtener el límite de reservas');
      }
    };

    fetchLimiteReservas();
  }, []);

  useEffect(() => {
    const fetchConfiguracion = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró un token de acceso');
        }

        const response = await fetch('http://localhost:3001/configuracion/horarios', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener los horarios');
        }

        const data = await response.json();
        setHorarios(data.horarios);
      } catch (error) {
        console.error('Error al obtener los horarios:', error);
        toast.error('Error al obtener los horarios');
      }
    };

    fetchConfiguracion();
  }, []);

  useEffect(() => {
    const fetchTiempoAnticipacion = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró un token de acceso');
        }

        const response = await fetch('http://localhost:3001/configuracion/anticipacion', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener el tiempo de anticipación');
        }

        const data = await response.json();
        setTiempoAnticipacion(data.tiempoAnticipacion);
      } catch (error) {
        console.error('Error al obtener el tiempo de anticipación:', error);
        toast.error('Error al obtener el tiempo de anticipación');
      }
    };

    fetchTiempoAnticipacion();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      setLoading(true);
      setError(null);
  
      if (!nombre || !fecha || !cantidadPersonas || !tipoServicio) {
        setError('Por favor complete todos los campos');
        setLoading(false);
        return;
      }
  
      if (parseInt(cantidadPersonas, 10) <= 0) {
        setError('La cantidad de personas debe ser mayor a 0');
        setLoading(false);
        return;
      }
  
      const fechaActual = dayjs().startOf('day');
      if (dayjs(fecha).isBefore(fechaActual)) {
        setError('No se pueden hacer reservas para fechas pasadas');
        setLoading(false);
        return;
      }
  
      const fechaMaxima = fechaActual.add(1, 'year');
      if (dayjs(fecha).isAfter(fechaMaxima)) {
        setError('No se pueden hacer reservas más de un año en adelante');
        setLoading(false);
        return;
      }
  
      if (telefono.length < 7 || telefono.length > 14) {
        setError('El número de teléfono debe tener entre 7 y 14 números');
        setLoading(false);
        return;
      }
  
      // Validar si la fecha seleccionada está en las fechas cerradas
      if (fechasCerradas.some(fechaCerrada => dayjs(fecha).isSame(dayjs(fechaCerrada), 'day'))) {
        setError(' Esta fecha esta cerrado :(');
        setLoading(false);
        return;
      }
  
      if (tiempoAnticipacion !== null) {
        const horaAnticipacionMinima = fechaActual.add(tiempoAnticipacion, 'hour');
        if (dayjs(fecha).isBefore(horaAnticipacionMinima)) {
          const mensajeError = `La reserva debe hacerse con al menos ${tiempoAnticipacion} horas de anticipación`;
          throw new Error(mensajeError);
        }
      } else {
        console.warn('No se pudo obtener el tiempo de anticipación. Validación omitida.');
        throw new Error('No se pudo obtener el tiempo de anticipación. Validación omitida.');
      }
  
      const fechaSeleccionada = dayjs(fecha);
      if (tipoServicio && horarios[tipoServicio.toLowerCase()]) {
        const { inicio, fin } = horarios[tipoServicio.toLowerCase()];
        const horaInicio = fechaSeleccionada.set('hour', parseInt(inicio.split(':')[0])).set('minute', parseInt(inicio.split(':')[1]));
        const horaFin = fechaSeleccionada.set('hour', parseInt(fin.split(':')[0])).set('minute', parseInt(fin.split(':')[1]));
  
        if (fechaSeleccionada.isBefore(horaInicio) || fechaSeleccionada.isAfter(horaFin)) {
          setError(`La reserva para ${tipoServicio} debe hacerse entre ${inicio} y ${fin}`);
          setLoading(false);
          return;
        }
      }
  
      const reservaData = {
        nombre,
        telefono,
        fecha: fechaSeleccionada.toISOString(),
        cantidadPersonas: parseInt(cantidadPersonas, 10),
        tipoServicio,
      };
  
      const response = await onReservaSubmit(reservaData);
  
      if (!response.ok) {
        const responseData = await response.json();
        if (responseData.message === 'Límite de reservas alcanzado') {
          throw new Error('Límite de reservas alcanzado');
        }
        throw new Error('No se pudo crear la reserva');
      }
  
      const responseData = await response.json();
      setReservaGuardada(responseData);
      setNombre('');
      setTelefono('');
      setCantidadPersonas('');
      setFecha(null);
      setTipoServicio('');
      toast.success('¡Reserva creada exitosamente!');
    } catch (error) {
      console.error('Error al crear la reserva:', error);
  
      if (error.message === 'Límite de reservas alcanzado') {
        toast.error('No hay más lugar :(');
      } else {
        toast.error('No se pudo crear la reserva');
      }
  
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  

  const handleAlertClose = () => {
    setShowAlert(false);
  };
  
  

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <ToastContainer />
      {loading ? (
        <Loading />
      ) : (
        <div className="w-100 d-flex justify-content-center align-items-center flex-column">
          {/* Alerta de Anticipación */}
          {showAlert && (
            <AnticipacionAlert
              tiempoAnticipacion={tiempoAnticipacion}
              onClose={handleAlertClose}
            />
          )}
          {/* Formulario */}
          <div
            className={`p-4 mb-5 rounded shadow ${reservaGuardada ? 'd-none' : ''}`}
            style={{ maxWidth: '420px', margin: '20px' }}
            >
            <h2 className="text-center mb-4 mt-4">CREAR RESERVA</h2>
            <form onSubmit={handleSubmit}>
              <TextField
                id="nombre"
                label="Nombre"
                variant="outlined"
                fullWidth
                margin="normal"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                />
              <TextField
                id="cantidadPersonas"
                label="Cantidad de Personas"
                variant="outlined"
                type="number"
                fullWidth
                margin="normal"
                value={cantidadPersonas}
                onChange={(e) => setCantidadPersonas(e.target.value)}
                />
              <TextField
                id="telefono"
                label="Teléfono"
                variant="outlined"
                type="tel"
                fullWidth
                margin="normal"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                />
              <FormControl variant="outlined" fullWidth margin="normal">
                <InputLabel id="tipoServicio-label">Tipo de Servicio</InputLabel>
                <Select
                  labelId="tipoServicio-label"
                  id="tipoServicio"
                  value={tipoServicio}
                  onChange={(e) => setTipoServicio(e.target.value)}
                  label="Tipo de Servicio"
                  >
                  <MenuItem value="">Seleccionar Tipo de Servicio</MenuItem>
                  <MenuItem value="Desayuno">Desayuno</MenuItem>
                  <MenuItem value="Almuerzo">Almuerzo</MenuItem>
                  <MenuItem value="Merienda">Merienda</MenuItem>
                  <MenuItem value="Cena">Cena</MenuItem>
                </Select>
              </FormControl>
              <LocalizationProvider dateAdapter={AdapterDayjs} >
                <DateTimePicker
                  label="Fecha y Hora"
                  value={fecha}
                  onChange={(date) => setFecha(date)}
                  fullWidth
                  margin="normal"
                  inputProps={{ style: { width: '100%' } }}
                  />
              </LocalizationProvider>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className="w-100 mt-4"
                style={{ backgroundColor: '#000', color: '#fff' }}
                
                >
                Guardar Reserva
              </Button>
              {error && <p style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>{error}</p>}
            </form>
          </div>
          {/* Tarjeta de reserva */}
          {reservaGuardada && (
            <div className="w-100 d-flex justify-content-center align-items-center mt-4">
              <Card style={{ width: '23rem', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.4)' }}>
                <Card.Img variant="top" src={reserva} />
                <Card.Body>
                  <Card.Title className="text-center">Reserva Exitosa</Card.Title>
                  <Card.Text className="text-center">
                    <strong>Nombre:</strong> {reservaGuardada.nombre} <br />
                    <strong>Teléfono:</strong> {reservaGuardada.telefono} <br />
                    <strong>Fecha y Hora:</strong> {dayjs(reservaGuardada.fecha).format('DD/MM/YYYY HH:mm')} <br />
                    <strong>Cantidad de Personas:</strong> {reservaGuardada.cantidadPersonas} <br />
                    <strong>Tipo de Servicio:</strong> {reservaGuardada.tipoServicio} <br />
                  </Card.Text>
                  <div className="text-center">
                    <PDFDownloadLink document={<ReservaPDF reserva={reservaGuardada} />} fileName="reserva.pdf">
                      {({ blob, url, loading, error }) =>
                        loading ? 'Cargando documento...' : 'Descargar PDF'
                    }
                    </PDFDownloadLink>
                  </div>
                </Card.Body>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReservaForm;
