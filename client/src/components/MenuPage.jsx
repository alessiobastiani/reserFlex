import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import Navbar1 from './Navbar1'; // Asegúrate de tener un componente Navbar1 o reemplazarlo por el que estés usando.

const categories = [
  'Todos',
  'Entradas', 'Ensaladas', 'Sopas y Caldos', 'Carnes', 'Pescados y Mariscos',
  'Pastas', 'Arroces', 'Platos Vegetarianos', 'Postres',
  'Bebidas', 'Especialidades de la Casa', 'Menú Infantil', 'Opciones sin Gluten / Veganas'
];

const MenuPage = () => {
  const [menus, setMenus] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/menus');
        if (!response.ok) {
          throw new Error('Error al obtener los menús');
        }
        const data = await response.json();
        setMenus(data.menus);
      } catch (error) {
        console.error('Error fetching menus:', error);
      }
    };

    fetchMenus();
  }, []);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  // Filtra los menús según la categoría seleccionada
  const filteredMenus = selectedCategory === 'Todos'
    ? menus
    : menus.filter(menu => menu.category === selectedCategory);

  return (
    <div>
      <Navbar1 />
      <Container sx={{ marginTop: '100px' }}> {/* Ajusta el margen superior aquí */}
        <Box textAlign="center" mb={4}>
          <Typography variant="h3" component="h1" gutterBottom>
            Nuestro Menú
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Descubre nuestra variedad de platos deliciosos.
          </Typography>
        </Box>
        <Box mb={4}>
          <FormControl fullWidth>
            <InputLabel>Categoría</InputLabel>
            <Select
              value={selectedCategory}
              onChange={handleCategoryChange}
              label="Categoría"
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Grid container spacing={3}>
          {filteredMenus.map((menu) => (
            <Grid item xs={12} sm={6} md={4} key={menu._id}>
              <Card sx={{ maxWidth: 345, boxShadow: 3, borderRadius: 2 }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="200"
                    image={`http://localhost:3001/uploads/${menu.imageUrl}`} // Asegúrate de construir la URL correctamente
                    alt={menu.name}
                    sx={{ objectFit: 'cover', borderTopLeftRadius: 2, borderTopRightRadius: 2 }}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      {menu.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {menu.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default MenuPage;
