import React, { useState, useEffect } from 'react';
import { ResponsivePie } from '@nivo/pie';

const ReservationChart = () => {
  const [reservationData, setReservationData] = useState([]);
  const colors = [
    '#B3E0FF', '#CCE6FF', '#E6F0FF', '#F0F7FF', '#F5FAFF'
  ];
  
  useEffect(() => {
    const fetchReservationData = async () => {
      try {
        // Obtener el token almacenado en localStorage
        const token = localStorage.getItem('token');
        // Verificar si el token está presente
        if (!token) {
          throw new Error('No se ha encontrado el token de autenticación');
        }
        const response = await fetch('http://localhost:3001/api/reservas-por-tipo', {
          headers: {
            Authorization: `Bearer ${token}` // Agregar el token al encabezado de autorización
          }
        });
        const data = await response.json();
        // Formatear los datos para que coincidan con el formato requerido por el componente de gráfico circular de Nivo
        const formattedData = Object.keys(data).map(tipo => ({
          id: tipo,
          label: tipo,
          value: data[tipo]
        }));
        setReservationData(formattedData);
      } catch (error) {
        console.error('Error fetching reservation data:', error);
      }
    };

    fetchReservationData();
  }, []);

  return (
    <div style={{ height: '400px' }}>
      <ResponsivePie
        data={reservationData}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        colors={{ scheme: 'paired' }}
        borderWidth={1}
        borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
        radialLabelsSkipAngle={10}
        radialLabelsTextXOffset={6}
        radialLabelsTextColor="#333333"
        radialLabelsLinkOffset={0}
        radialLabelsLinkDiagonalLength={16}
        radialLabelsLinkHorizontalLength={24}
        radialLabelsLinkStrokeWidth={1}
        radialLabelsLinkColor={{ from: 'color' }}
        sliceLabelsSkipAngle={10}
        sliceLabelsTextColor="#333333"
        legends={[
          {
            anchor: 'bottom',
            direction: 'row',
            translateY: 56,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: '#999',
            symbolSize: 18,
            symbolShape: 'circle',
            effects: [
              {
                on: 'hover',
                style: {
                  itemTextColor: '#000',
                }
              }
            ]
          }
        ]}
      />
    </div>
  );
};

export default ReservationChart;
