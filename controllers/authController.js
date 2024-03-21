const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const secretKey = 'tu_secreto_jwt_aqui';

const signup = async (req, res) => {
  try {
    const { username, password, email, phone } = req.body; // Asegúrate de obtener también el campo `phone`
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Verificar si el usuario que se registra es un administrador
    if (username === adminUsername && password === adminPassword) {
      // Crear un nuevo usuario administrador
      const newUser = new User({ username, password, email, phone, isAdmin: true, isAuthorized: true }); // Agrega `phone` aquí
      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(password, salt);
      await newUser.save();

      // Crear token JWT para el nuevo usuario administrador
      const token = jwt.sign({ id: newUser._id, isAdmin: true }, secretKey);
      return res.json({ message: 'Registro exitoso como administrador', token });
    } else {
      // Crear un nuevo usuario regular
      const newUser = new User({ username, password, email, phone, isAuthorized: true }); // Agrega `phone` aquí
      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(password, salt);
      await newUser.save();

      // Crear token JWT para el nuevo usuario regular
      const token = jwt.sign({ id: newUser._id, isAdmin: false }, secretKey);
      return res.json({ message: 'Registro exitoso', token });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Buscar el usuario en la base de datos
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Nombre de usuario o contraseña incorrectos' });
    }

    // Verificar la contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Nombre de usuario o contraseña incorrectos' });
    }

    // Configurar isAdmin en true si el usuario es un administrador
    const isAdmin = user.isAdmin; // O utiliza algún otro atributo que indique si el usuario es un administrador

    // Generar token JWT incluyendo isAdmin
    const token = jwt.sign({ id: user.id, isAdmin }, secretKey, { expiresIn: '1h' });

    // Devolver el token y el estado de administrador en la respuesta
    return res.json({ message: 'Inicio de sesión exitoso', token, isAdmin });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    // Consultar todos los usuarios en la base de datos
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};


const logout = (req, res) => {
  req.logout();
  res.json({ message: 'Cierre de sesión exitoso' });
};

module.exports = {
  signup,
  login,
  logout,
  getUsers
};
