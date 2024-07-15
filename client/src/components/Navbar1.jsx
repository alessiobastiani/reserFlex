import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logout from './Logout';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import ToggleColorMode from './ToggleColorMode'; // Adjust the import if necessary
import reser from  '../assets/reser.png'
import Button from '@mui/material/Button';


const logoStyle = {
  width: '140px',
  height: 'auto',
  cursor: 'pointer',
};

function Navbar1({ mode, toggleColorMode }) {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const scrollToSection = (sectionId) => {
    const sectionElement = document.getElementById(sectionId);
    const offset = 128;
    if (sectionElement) {
      const targetScroll = sectionElement.offsetTop - offset;
      sectionElement.scrollIntoView({ behavior: 'smooth' });
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth',
      });
      setOpen(false);
    }
  };

  return (
    <div>
      <AppBar
        position="fixed"
        sx={{
          boxShadow: 0,
          bgcolor: 'transparent',
          backgroundImage: 'none',
          mt: 2,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            variant="regular"
            sx={(theme) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
              borderRadius: '999px',
              bgcolor:
                theme.palette.mode === 'light'
                  ? 'rgba(255, 255, 255, 0.4)'
                  : 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(24px)',
              maxHeight: 40,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow:
                theme.palette.mode === 'light'
                  ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                  : '0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)',
            })}
          >
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                ml: '-18px',
                px: 0,
              }}
            >
              <Link to="/inicio" style={{ textDecoration: 'none', color: 'inherit' }}>
                <img
                  src={reser}
                  style={logoStyle}
                  alt="logo of sitemark"
                />
              </Link>
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button
                  component={Link}
                  to="/ultima-reserva"
                  variant="text"
                  sx={{
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: 'normal',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Última Reserva
                </Button>
              </Box>
            </Box>
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                gap: 0.5,
                alignItems: 'center',
              }}
            >
              <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} />
              <Logout />
            </Box>
            <Box sx={{ display: { sm: '', md: 'none' } }}>
              <Button
                variant="text"
                color="primary"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{ minWidth: '30px', p: '4px' }}
              >
                <MenuIcon />
              </Button>
              <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
                <Box
                  sx={{
                    minWidth: '60dvw',
                    p: 2,
                    backgroundColor: 'background.paper',
                    flexGrow: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'end',
                      flexGrow: 1,
                    }}
                  >
                    <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} />
                  </Box>
                  <Button
                  component={Link}
                  to="/ultima-reserva"
                  sx={{
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: 'normal',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  ultima reserva
                  </Button>
                  <Divider />
                  <MenuItem>
                    <Logout />
                  </MenuItem>
                </Box>
              </Drawer>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
}

Navbar1.propTypes = {
  mode: PropTypes.oneOf(['dark', 'light']).isRequired,
  toggleColorMode: PropTypes.func.isRequired,
};

export default Navbar1;
