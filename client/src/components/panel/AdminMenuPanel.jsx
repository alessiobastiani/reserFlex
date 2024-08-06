import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const Input = styled('input')({
  display: 'none',
});

const categories = [
  'Entradas', 'Ensaladas', 'Sopas y Caldos', 'Carnes', 'Pescados y Mariscos',
  'Pastas', 'Arroces', 'Platos Vegetarianos', 'Postres',
  'Bebidas', 'Especialidades de la Casa', 'Menú Infantil', 'Opciones sin Gluten / Veganas'
];

const AdminMenuPanel = () => {
  const [menus, setMenus] = useState([]);
  const [newMenuName, setNewMenuName] = useState('');
  const [newMenuDescription, setNewMenuDescription] = useState('');
  const [newMenuImage, setNewMenuImage] = useState(null);
  const [newMenuCategory, setNewMenuCategory] = useState('');
  const [editingMenuId, setEditingMenuId] = useState(null);
  const [editingMenuName, setEditingMenuName] = useState('');
  const [editingMenuDescription, setEditingMenuDescription] = useState('');
  const [editingMenuCategory, setEditingMenuCategory] = useState('');
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/menus', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setMenus(data.menus);
    } catch (error) {
      console.error('Error fetching menus:', error);
      setAlert({ open: true, message: 'Error al obtener los menús', severity: 'error' });
    }
  };

  const handleAddMenu = async () => {
    const formData = new FormData();
    formData.append('name', newMenuName);
    formData.append('description', newMenuDescription);
    formData.append('category', newMenuCategory);
    if (newMenuImage) {
      formData.append('image', newMenuImage);
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/menus', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const newMenu = await response.json();
      setMenus([...menus, newMenu]);
      setNewMenuName('');
      setNewMenuDescription('');
      setNewMenuImage(null);
      setNewMenuCategory('');
      setAlert({ open: true, message: 'Menú añadido con éxito', severity: 'success' });
    } catch (error) {
      console.error('Error adding menu:', error);
      setAlert({ open: true, message: 'Error al añadir el menú', severity: 'error' });
    }
  };

  const handleEditMenu = async () => {
    const formData = new FormData();
    formData.append('name', editingMenuName);
    formData.append('description', editingMenuDescription);
    formData.append('category', editingMenuCategory);
    if (newMenuImage) {
      formData.append('image', newMenuImage);
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/menus/${editingMenuId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const updatedMenu = await response.json();
      setMenus(menus.map(menu => (menu._id === updatedMenu._id ? updatedMenu : menu)));
      setEditingMenuId(null);
      setEditingMenuName('');
      setEditingMenuDescription('');
      setEditingMenuCategory('');
      setNewMenuImage(null);
      setAlert({ open: true, message: 'Menú actualizado con éxito', severity: 'success' });
    } catch (error) {
      console.error('Error updating menu:', error);
      setAlert({ open: true, message: 'Error al actualizar el menú', severity: 'error' });
    }
  };

  const handleDeleteMenu = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/menus/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setMenus(menus.filter(menu => menu._id !== id));
      setAlert({ open: true, message: 'Menú eliminado con éxito', severity: 'success' });
    } catch (error) {
      console.error('Error deleting menu:', error);
      setAlert({ open: true, message: 'Error al eliminar el menú', severity: 'error' });
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Gestión de Menús</Typography>
      <Box mb={3}>
        <TextField
          label="Nombre del menú"
          value={newMenuName}
          onChange={(e) => setNewMenuName(e.target.value)}
          fullWidth
        />
        <TextField
          label="Descripción del menú"
          value={newMenuDescription}
          onChange={(e) => setNewMenuDescription(e.target.value)}
          fullWidth
          sx={{ mt: 2 }}
        />
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Categoría</InputLabel>
          <Select
            value={newMenuCategory}
            onChange={(e) => setNewMenuCategory(e.target.value)}
            label="Categoría"
          >
            {categories.map(category => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ mt: 2 }}>
          <label htmlFor="contained-button-file">
            <Input
              accept="image/*"
              id="contained-button-file"
              type="file"
              onChange={(e) => setNewMenuImage(e.target.files[0])}
            />
            <Button variant="contained" component="span">
              Seleccionar Imagen
            </Button>
          </label>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddMenu}
          >
            Añadir Menú
          </Button>
        </Box>
      </Box>
      {editingMenuId && (
        <Box mb={3}>
          <TextField
            label="Nombre del menú"
            value={editingMenuName}
            onChange={(e) => setEditingMenuName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Descripción del menú"
            value={editingMenuDescription}
            onChange={(e) => setEditingMenuDescription(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Categoría</InputLabel>
            <Select
              value={editingMenuCategory}
              onChange={(e) => setEditingMenuCategory(e.target.value)}
              label="Categoría"
            >
              {categories.map(category => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ mt: 2 }}>
            <label htmlFor="contained-button-file-edit">
              <Input
                accept="image/*"
                id="contained-button-file-edit"
                type="file"
                onChange={(e) => setNewMenuImage(e.target.files[0])}
              />
              <Button variant="contained" component="span">
                Seleccionar Imagen
              </Button>
            </label>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditMenu}
            >
              Actualizar Menú
            </Button>
          </Box>
        </Box>
      )}
      {menus.map(menu => (
        <Card key={menu._id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{menu.name}</Typography>
            <Typography variant="body2">{menu.description}</Typography>
            <Typography variant="body2">Categoría: {menu.category}</Typography>
          </CardContent>
          <CardActions>
            <IconButton onClick={() => {
              setEditingMenuId(menu._id);
              setEditingMenuName(menu.name);
              setEditingMenuDescription(menu.description);
              setEditingMenuCategory(menu.category);
            }}>
              <Edit />
            </IconButton>
            <IconButton onClick={() => handleDeleteMenu(menu._id)}>
              <Delete />
            </IconButton>
          </CardActions>
        </Card>
      ))}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.severity}
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminMenuPanel;
