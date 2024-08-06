import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useThemeMode } from './themeConfig';
import Dashboard from './panel/Dashboard';

const AdminPanel = () => {
  const { theme, mode, toggleColorMode } = useThemeMode();
  
  // Obtener el rol del usuario desde el almacenamiento local
  const role = localStorage.getItem('role');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Dashboard mode={mode} toggleColorMode={toggleColorMode} role={role} />
    </ThemeProvider>
  );
};

export default AdminPanel;
