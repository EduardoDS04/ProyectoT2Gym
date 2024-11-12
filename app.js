const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

// Configuración del archivo .env
dotenv.config({ path: './stack_gym/.env' });

// Importamos las rutas
const authRoutes = require('./routes/authRouter');
const clienteRoutes = require('./routes/clienteRouter');
const entrenadorRoutes = require('./routes/entrenadorRouter');

// Inicializar la aplicación Express
const app = express();

// Configuración de middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuración de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Rutas
app.use('/auth', authRoutes);         // Rutas de autenticación (registro, inicio de sesión, etc.)
app.use('/clientes', clienteRoutes);   // Rutas de clientes (CRUD de clientes)
app.use('/entrenadores', entrenadorRoutes);  // Rutas de entrenadores (CRUD de entrenadores)

// Ruta principal
app.get('/', (req, res) => {
    res.send('Bienvenido al sistema de gestión de gimnasio');
});

// Manejo de errores de rutas no encontradas
app.use((req, res, next) => {
    res.status(404).send("Página no encontrada");
});

// Configuración del puerto y conexión al servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
