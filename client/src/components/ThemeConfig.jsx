// themeConfig.js
import { useState } from 'react';
import { createTheme } from '@mui/material';

export const getLPTheme = (mode) => ({
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

export const useThemeMode = () => {
  const [mode, setMode] = useState('light');

  const toggleColorMode = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const theme = createTheme(getLPTheme(mode));

  return { theme, mode, toggleColorMode };
};
