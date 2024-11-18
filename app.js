const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const session = require('express-session'); // Asegúrate de incluir express-session

// Configuración del archivo .env
dotenv.config({ path: './stack_gym/.env' });

// Importamos las rutas
const authRouter = require('./routes/authRouter');
const entrenadorRouter = require('./routes/entrenadorRouter');
const clienteRouter = require('./routes/clienteRouter');

// Inicializar la aplicación Express
const app = express();
const port = process.env.PORT || 3000; // Define la variable `port` correctamente

// Configuración de middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuración de sesiones
app.use(
    session({
        secret: 'misupersecretoquenadiesabe',
        resave: true,
        saveUninitialized: false,
    })
);

app.use((req, res, next) => {
    res.locals.user = req.session.user || null; // O ajusta según tu implementación
    next();
  });
  

// Configuración de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Rutas
app.use('/auth', authRouter); // Rutas de autenticación (registro, inicio de sesión, etc.)
app.use('/Entrenador', entrenadorRouter); // Rutas de entrenadores (CRUD de entrenadores)
app.use('/Cliente',clienteRouter);



// Ruta principal
app.get('/', (req, res) => {
    if (req.session.user) {
        res.render('index', { user: req.session.user, titulo: 'Inicio' });
    } else {
        res.redirect('/auth/login');
    }
});

// Manejo de errores de rutas no encontradas
app.use((req, res, next) => {
    res.status(404).send('Página no encontrada');
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
});