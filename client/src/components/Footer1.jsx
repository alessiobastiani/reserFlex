import React from 'react';
import { Box, Typography } from '@mui/material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: '40px',
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200],
        boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography variant="body1" align="center">
        &copy; {new Date().getFullYear()} Derechos Reservados-ReserFlex
      </Typography>
    </Box>
  );
}

export default Footer;
