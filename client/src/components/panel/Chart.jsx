import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, axisClasses } from '@mui/x-charts';
import dayjs from 'dayjs'; // Importar dayjs para manipulación de fechas
import es from 'dayjs/locale/es'; // Importar la localización en español de dayjs
import Title from './Title';

// Establecer la localización en español para dayjs
dayjs.locale(es);

// Función para generar datos de reservas por día del mes
function generateDataForMonth(reservations) {
  const currentDay = dayjs().date();
  const data = [];

  // Inicializar array con ceros para cada día del mes hasta el día actual
  for (let i = 1; i <= currentDay; i++) {
    data.push({ day: i, amount: 0 });
  }

  // Contar la cantidad de reservas por día
  reservations.forEach(reservation => {
    const reservationDay = dayjs(reservation.createdAt).date(); // Usar la fecha de creación de la reserva
    if (reservationDay <= currentDay) {
      data[reservationDay - 1].amount++;
    }
  });

  return data;
}

export default function Chart() {
  const theme = useTheme();
  const [latestReservations, setLatestReservations] = React.useState([]);

  React.useEffect(() => {
    const fetchLatestReservations = async () => {
      try {
        const token = localStorage.getItem('token'); // Obtener el token de localStorage

        // Verificar si hay un token disponible
        if (!token) {
          throw new Error('No se encontró un token de acceso');
        }

        // Realizar la solicitud al servidor incluyendo el token en las cabeceras
        const response = await fetch('http://localhost:3001/api/reservas-ultimo-mes', {
          headers: {
            Authorization: `Bearer ${token}` // Incluir el token en las cabeceras de autorización
          }
        });

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
          throw new Error('Error al obtener las reservas');
        }

        // Convertir la respuesta a JSON
        const data = await response.json();

        // Establecer las reservas en el estado
        setLatestReservations(data.reservas);
      } catch (error) {
        console.error('Error fetching latest reservations:', error);
      }
    };

    fetchLatestReservations();
  }, []);

  // Generar datos para el mes actual
  const dataForMonth = generateDataForMonth(latestReservations);

  // Obtener el nombre del mes actual
  const currentMonthName = dayjs().format('MMMM');

  return (
    <React.Fragment>
      <Title>{`Reservas para ${currentMonthName}`}</Title>
      <div style={{ width: '100%', flexGrow: 1, overflow: 'hidden' }}>
        <LineChart
          dataset={dataForMonth}
          margin={{
            top: 16,
            right: 20,
            left: 70,
            bottom: 45,
          }}
          xAxis={[
            {
              label: 'Días',
              labelStyle: {
                ...theme.typography.body1,
                fill: theme.palette.text.primary,
              },
              scaleType: 'point',
              dataKey: 'day',
              tickNumber: 5, // Mostrar ticks de 5 en 5 días
              tickLabelStyle: theme.typography.body2,
            },
          ]}
          yAxis={[
            {
              label: 'Reservas',
              labelStyle: {
                ...theme.typography.body1,
                fill: theme.palette.text.primary,
              },
              tickLabelStyle: theme.typography.body2,
              tickValues: [0, 10, 30], // Configurar los valores de los ticks en el eje Y
            },
          ]}
          series={[
            {
              dataKey: 'amount',
              showMark: false,
              color: theme.palette.primary.light,
            },
          ]}
          sx={{
            [`.${axisClasses.root} line`]: { stroke: theme.palette.text.secondary },
            [`.${axisClasses.root} text`]: { fill: theme.palette.text.secondary },
            [`& .${axisClasses.left} .${axisClasses.label}`]: {
              transform: 'translateX(-25px)',
            },
          }}
        />
      </div>
    </React.Fragment>
  );
}

