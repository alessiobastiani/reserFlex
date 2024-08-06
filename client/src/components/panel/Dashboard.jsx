import React, { useState, useMemo } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EditIcon from '@mui/icons-material/Edit';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Chart from './Chart';
import Deposits from './Deposits';
import Orders from './Orders';
import ReservasHoy from './ReservasHoy';
import { secondaryListItems } from './listItems';
import ReservationChart from './ReservationChart';
import ClientCard from './ClientCard';
import Calendario from './Calendario';
import EditarReserva from './EditarReserva';
import TodasReservas from './TodasReservas';
import LimitConfig from './LimitConfig';
import NotificationsPanel from './NotificationsPanel';
import AdminMenuPanel from './AdminMenuPanel'; // Asegúrate de que la ruta sea correcta


const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

export default function Dashboard({ mode, toggleColorMode, role }) {
  const [open, setOpen] = useState(true);
  const [selectedOption, setSelectedOption] = useState('Dashboard');
  const [latestReservations, setLatestReservations] = useState([]);

  React.useEffect(() => {
    const fetchLatestReservations = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró un token de acceso');
        }
        const response = await fetch('http://localhost:3001/api/reservas/latests', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error al obtener las últimas reservas: ${response.status} ${errorText}`);
        }
        const data = await response.json();
        setLatestReservations(data.reservas);
      } catch (error) {
        console.error('Error fetching latest reservations:', error);
      }
    };
    fetchLatestReservations();
  }, []);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  let content;
  if (selectedOption === 'Dashboard') {
    content = (
      <Grid container spacing={3}>
        <Grid item xs={12} md={8} lg={9}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 240 }}>
            <Chart />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} lg={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 240 }}>
            <Deposits />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Orders latestReservations={latestReservations} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <ReservationChart />
          </Paper>
        </Grid>
      </Grid>
    );
  } else if (selectedOption === 'ReservasHoy') {
    content = <ReservasHoy />;
  } else if (selectedOption === 'Clientes') {
    content = <ClientCard />;
  } else if (selectedOption === 'Calendario') {
    content = <Calendario />;
  } else if (selectedOption === 'EditarReserva') {
    content = <EditarReserva />;
  } else if (selectedOption === 'TodasReservas') {
    content = <TodasReservas />;
  } else if (selectedOption === 'LimitConfig') {
    content = <LimitConfig />;
  }else if (selectedOption === 'NotificationsPanel') {
    content = <NotificationsPanel  />;
  }else if (selectedOption === 'AdminMenuPanel') {
    content = <AdminMenuPanel />;
  }

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar sx={{ pr: '24px' }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h5"
              color="inherit"
              noWrap
              sx={{
                flexGrow: 1,
                fontFamily: 'cursive',
              }}
            >
              reserFlex
            </Typography>
            <IconButton onClick={toggleColorMode} color="inherit">
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <ListItemButton onClick={() => handleOptionClick('Dashboard')}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
            <ListItemButton onClick={() => handleOptionClick('ReservasHoy')}>
              <ListItemIcon>
                <ShoppingCartIcon />
              </ListItemIcon>
              <ListItemText primary="Reservas de hoy" />
            </ListItemButton>
            <ListItemButton onClick={() => handleOptionClick('TodasReservas')}>
              <ListItemIcon>
                <EventAvailableIcon />
              </ListItemIcon>
              <ListItemText primary="Todas las reservas" />
            </ListItemButton>
            <ListItemButton onClick={() => handleOptionClick('Clientes')}>
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Clientes" />
            </ListItemButton>
            <ListItemButton onClick={() => handleOptionClick('Calendario')}>
              <ListItemIcon>
                <CalendarTodayIcon />
              </ListItemIcon>
              <ListItemText primary="Calendario" />
            </ListItemButton>
            {role === 'admin' && (
              <>
                <ListItemButton onClick={() => handleOptionClick('EditarReserva')}>
                  <ListItemIcon>
                    <EditIcon />
                  </ListItemIcon>
                  <ListItemText primary="Editar Reservas" />
                </ListItemButton>
                <ListItemButton onClick={() => handleOptionClick('LimitConfig')}>
                  <ListItemIcon>
                    <EventAvailableIcon />
                  </ListItemIcon>
                  <ListItemText primary="Configuración" />
                </ListItemButton>
                <ListItemButton onClick={() => handleOptionClick('NotificationsPanel')}>
                  <ListItemIcon>
                    <EventAvailableIcon />
                  </ListItemIcon>
                  <ListItemText primary="Notificaciones" />
                </ListItemButton>
                <ListItemButton onClick={() => handleOptionClick('AdminMenuPanel')}>
      <ListItemIcon>
        <ShoppingCartIcon />
      </ListItemIcon>
      <ListItemText primary="Gestión de Menús" />
    </ListItemButton>
                <Divider sx={{ my: 1 }} />
                {secondaryListItems}
              </>
            )}
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
        >
          <Toolbar />
          <Container maxWidth="lg">
            {content}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
