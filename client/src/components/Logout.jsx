import React from 'react';
import Button from '@mui/material/Button';

const Logout = () => {
  const handleLogout = () => {
    localStorage.removeItem('token'); // Elimina el token del almacenamiento local
    // Redirige al usuario a la página de inicio de sesión u otra página relevante
    window.location.href = '/';
  };

  return (
    <Button
      variant="text"
      onClick={handleLogout}
      sx={{
        textDecoration: 'none',
        fontSize: '13px',
        fontWeight: 'normal',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
      }}
    >
      Cerrar sesión
    </Button>
  );
};

export default Logout;
