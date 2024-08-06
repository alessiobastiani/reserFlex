const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const secretKey = 'tu_secreto_jwt_aqui';

const signup = async (req, res) => {
  try {
    const { fullName, username, password, email, phone } = req.body;
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const supervisorUsername = process.env.SUPERVISOR_USERNAME;
    const supervisorPassword = process.env.SUPERVISOR_PASSWORD;

    let role = 'user';

    // Verificar si el usuario que se registra es un administrador o supervisor
    if (username === adminUsername && password === adminPassword) {
      role = 'admin';
    } else if (username === supervisorUsername && password === supervisorPassword) {
      role = 'supervisor';
    }

    // Crear un nuevo usuario
    const newUser = new User({ fullName, username, password, email, phone, role, isAuthorized: true });
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);
    await newUser.save();

    // Crear token JWT para el nuevo usuario
    const token = jwt.sign({ id: newUser._id, role }, secretKey);
    return res.json({ message: `Registro exitoso como ${role}`, token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Buscar el usuario por nombre de usuario o correo electrónico
    const user = await User.findOne({ $or: [{ username: identifier }, { email: identifier }] });
    if (!user) {
      return res.status(401).json({ message: 'Nombre de usuario o correo electrónico incorrectos' });
    }

    // Verificar la contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Generar token JWT incluyendo el rol
    const token = jwt.sign({ id: user.id, role: user.role }, secretKey, { expiresIn: '1h' });

    // Devolver el token y el rol en la respuesta
    return res.json({ message: 'Inicio de sesión exitoso', token, role: user.role });
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
  getUsers,
};
