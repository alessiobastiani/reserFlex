import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const CurrentDateTime = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000); // Actualizar cada segundo

    return () => clearInterval(interval);
  }, []);

  const formattedDate = format(currentDateTime, 'PPPP', { locale: es });
  const formattedTime = format(currentDateTime, 'p', { locale: es });

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        mb: 8,
        px: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 500,
          width: '100%',
          borderRadius: 3,
          boxShadow: 4,
          bgcolor: 'background.paper',
          border: `1px solid`,
          borderColor: 'divider',
          overflow: 'hidden',
        }}
      >
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <AccessTimeIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
          <Typography
            variant="h5"
            component="h2"
            sx={{ mb: 1, color: 'text.primary', fontWeight: 'bold' }}
          >
            Fecha y Hora Actual
          </Typography>
          <Typography
            variant="body1"
            sx={{ mb: 0.5, color: 'text.secondary' }}
          >
            {formattedDate}
          </Typography>
          <Typography
            variant="h6"
            sx={{ mb: 0, color: 'primary.main', fontWeight: 'medium' }}
          >
            {formattedTime}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CurrentDateTime;
