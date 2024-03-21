const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportConfig = require('./config/passport-config');
const reservaRouter = require('./routes/reservas');
const authRouter = require('./routes/auth');
const dashboardRouter = require('./routes/dashboard');
const flash = require('express-flash');
const ensureAuthenticated = require('./middleware/authMiddleware');
const debug = require('debug')('app:db');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
process.env.TZ = 'America/Argentina/Buenos_Aires';
require('dotenv').config();


// Importar los plugins de UTC y zona horaria de dayjs
dayjs.extend(utc);
dayjs.extend(timezone);

// Configurar la zona horaria para Buenos Aires
dayjs.tz.setDefault('America/Argentina/Buenos_Aires');

console.log('Zona horaria actual:', process.env.TZ);

console.log("Configuración de depuración de Mongoose ejecutada");
mongoose.set('debug', (collectionName, method, query, doc) => {
  debug(`${collectionName}.${method}`, JSON.stringify(query), doc);
});

const app = express();
const PORT = process.env.PORT || 3001;

mongoose.connect('mongodb://127.0.0.1:27017/sistemaDeReservas', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors({ 
  origin: 'http://localhost:5173', 
  credentials: true 
}));
app.use(express.json());
app.use(
  session({
    secret: 'mi-secreto-aqui',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passportConfig(); // Llama a la función de configuración de Passport.js

// Middleware para proteger las rutas de reserva
app.use('/api/reservas', ensureAuthenticated, reservaRouter);

app.use('/api', reservaRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', dashboardRouter);

app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});


