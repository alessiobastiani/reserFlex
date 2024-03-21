// authMiddleware.js
const jwt = require('jsonwebtoken');
const secretKey = 'tu_secreto_jwt_aqui';

const ensureAuthenticated = (req, res, next) => {
  console.log("Verificando autenticación...");
  console.log("Token JWT:", req.headers.authorization);

  // Verificar si se proporciona el token JWT en el encabezado de autorización
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No se proporcionó un token JWT' });
  }

  // Verificar y decodificar el token JWT
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      console.error("Error al verificar el token JWT:", err);
      return res.status(401).json({ message: 'Token JWT inválido o expirado' });
    }
    
    // Establecer el usuario decodificado en la solicitud
    req.user = decoded;
    console.log("Usuario autenticado:", req.user);
    
    // Permitir el acceso a la ruta protegida
    next();
  });
};

module.exports = ensureAuthenticated;
