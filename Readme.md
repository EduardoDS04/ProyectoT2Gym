# Proyecto Tema 2 Gimnasio
## Eduardo Díaz y María López


### CREACIÓN DEL PROYECTO

En primer lugar, creamos una carpeta y dentro de ella se ejecuta:
 `npm install express express-session mysql2 pug body-parser dotenv`

 Se crean dos ficheros y una carpeta:
 - package-lock.json
 - package.json
 - node_modules
  


### GIT  
Creamos el fichero `.gitignore` que contiene
```bash
node_modules
package-lock.json
.env
``` 

Y hacemos un _git init_, que nos creará un nuevo repositorio git.

Para hacer un commit a una rama estando en otra:
Por ejemplo de la rama dev quiero comitear a la rama maria.
`git merge maria`  y luego un `git merge origin dev`

Para actualizar el repositorio con el comit subido al git:
`git pull`


### STACK_GYM

Hemos creado una carpeta llamada **stack_gym** que contiene el `docker-compose.yml`, el `.env` y una carpeta **script** con un fichero `initdb.sql` que contendrá las tablas.

_docker-compose.yml_
```bash
version: '3.1'

services:

  adminer:
    image: adminer
    restart: "no"
    ports:
      - ${ADMINER_PORT}:8080

  db-gimnasio:
    image: mysql:latest
    restart: "no"
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
    ports:
      - ${MYSQL_PORT}:3306
    volumes:
      - ./scripts:/docker-entrypoint-initdb.d
``` 

_.env_
```bash
MYSQL_ROOT_PASSWORD = zx76wbz7FG89k
MYSQL_USERNAME=root
MYSQL_PORT=33307
MYSQL_DATABASE=gimnasio
MYSQL_HOST=localhost
ADMINER_PORT= 8182
```

Fichero `initdb.sql` para crear las tablas y se ha insertado los datos de cada una de ellas.
```bash
CREATE DATABASE IF NOT EXISTS `gimnasio`;

USE `gimnasio`;
DROP TABLE IF EXISTS ClientePlan;
DROP TABLE IF EXISTS Sesion;
DROP TABLE IF EXISTS Plan_Membresia;
DROP TABLE IF EXISTS Cliente;
DROP TABLE IF EXISTS Entrenador;



-- Tabla para los clientes
CREATE TABLE Cliente (
  id INT AUTO_INCREMENT PRIMARY KEY,
  Nombre VARCHAR(255) NOT NULL,
  Correo VARCHAR(255) NOT NULL,
  Fecha_Registro DATE NOT NULL, 
  Telefono VARCHAR(20) NOT NULL
);

-- Tabla para los entrenadores
CREATE TABLE Entrenador(
  id INT AUTO_INCREMENT PRIMARY KEY,
  Nombre VARCHAR(255) NOT NULL,
  Especialidad VARCHAR(255) NOT NULL,
  Nivel_Experiencia VARCHAR(100) NOT NULL
);

-- Tabla para Plan_Membresia
CREATE TABLE Plan_Membresia(
    id INT AUTO_INCREMENT PRIMARY KEY,
    Nombre_Plan VARCHAR(100) NOT NULL,
    Duracion_Meses INT NOT NULL,
    Costo DECIMAL(10,2)
);

-- Tabla para Sesion
CREATE TABLE Sesion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_Cliente INT,
    id_Entrenador INT,
    Hora TIME,
    Fecha DATE,
    Duracion_Minutos INT,
    FOREIGN KEY (id_Cliente) REFERENCES Cliente(id),
    FOREIGN KEY (id_Entrenador) REFERENCES Entrenador(id)
);


-- Tabla para ClientePlan
CREATE TABLE ClientePlan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_Cliente INT,
    id_Plan INT,
    Fecha_Inicio DATE,
    FOREIGN KEY (id_Cliente) REFERENCES Cliente(id),
    FOREIGN KEY (id_Plan) REFERENCES Plan_Membresia(id)
);

CREATE TABLE IF NOT EXISTS users(
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `enabled` BOOL,
  tipo ENUM('ENTRENADOR', 'CLIENTE', 'ADMIN'),
  Cliente INT REFERENCES Cliente(id),
  Entrenador INT REFERENCES Entrenador(id)
);


INSERT INTO `users` (`username`, `password`, `enabled`, `tipo`)
  VALUES ('pepe', 'Secreto_123', 1, 'ENTRENADOR');




-- para que los acentos salgan bien
SET NAMES utf8mb4;



-- Insertar datos en Cliente
INSERT INTO Cliente (id, Nombre, Correo, Fecha_Registro, Telefono)
VALUES
    (1, 'Luis', 'cliente1@gymcorreo.com', '2016-03-23', '555-6983'),
    (2, 'Sofia', 'cliente2@gymcorreo.com', '2016-03-23', '555-6896'),
    (3, 'Ana', 'cliente3@gymcorreo.com', '2016-02-02', '555-6864'),
    (4, 'Ana', 'cliente4@gymcorreo.com', '2008-02-15', '555-4611'),
    (5, 'Sofia', 'cliente5@gymcorreo.com', '2010-01-07', '555-1593'),
    (6, 'Luis', 'cliente6@gymcorreo.com', '2013-05-28', '555-1116'),
    (7, 'Sofia', 'cliente7@gymcorreo.com', '2008-05-04', '555-2996'),
    (8, 'José', 'cliente8@gymcorreo.com', '1992-06-26', '555-9572'),
    (9, 'Lucía', 'cliente9@gymcorreo.com', '2019-09-06', '555-3335'),
    (10, 'María', 'cliente10@gymcorreo.com', '1990-09-22', '555-7920');
    

-- Insertar datos en Entrenador
INSERT INTO Entrenador (`id`, `Nombre`, `Especialidad`, `Nivel_Experiencia`)
  VALUES
    (1, 'Lucía', 'Crossfit', 'Intermedio'),
    (2, 'José', 'Pesas', 'Avanzado'),
    (3, 'María', 'Crossfit', 'Avanzado'),
    (4, 'Lucía', 'Crossfit', 'Intermedio'),
    (5, 'Carlos', 'Pesas', 'Principiante');


-- Insertar datos en Plan_Membresia
INSERT INTO Plan_Membresia (`id`, `Nombre_Plan`, `Duracion_Meses`, `Costo`)
  VALUES
    (1, 'Básico Anual', 12, 214.63),
    (2, 'Premium Mensual', 6, 181.74),
    (3, 'Elite Mensual', 3, 76.22);



-- Insertar datos en Sesion
INSERT INTO Sesion (id, Fecha, Hora, Duracion_Minutos, id_Cliente, id_Entrenador)
VALUES 
    (1, '2000-12-01', '05:00:00', 45, 8, 2),
    (2, '1991-12-14', '09:00:00', 45, 4, 3),
    (3, '2021-05-26', '10:00:00', 45, 6, 5),
    (4, '2011-05-05', '11:00:00', 60, 9, 4),
    (5, '2007-09-23', '09:00:00', 30, 8, 1),
    (6, '2005-09-29', '09:00:00', 90, 6, 1),
    (7, '2008-08-30', '03:00:00', 45, 8, 3),
    (8, '2005-10-02', '07:00:00', 90, 9, 4),
    (9, '2011-04-12', '11:00:00', 60, 5, 3),
    (10, '2001-01-09', '12:00:00', 60, 5, 3),
    (11, '1999-03-04', '08:00:00', 30, 8, 2),
    (12, '2001-08-05', '07:00:00', 30, 8, 5),
    (13, '1991-12-28', '03:00:00', 90, 6, 1),
    (14, '1996-11-06', '08:00:00', 90, 9, 3),
    (15, '2000-03-23', '04:00:00', 45, 1, 1);



-- Insertar datos en ClientePlan
INSERT INTO ClientePlan (id_Cliente, id_Plan, Fecha_Inicio)
VALUES 
    (3, 1, '2005-11-08'),
    (9, 3, '1998-07-03'),
    (2, 1, '2021-01-26'), 
    (2, 1, '1995-10-28'),
    (3, 3, '2003-09-21'),
    (9, 1, '2016-09-21'),
    (9, 1, '2020-12-23'),
    (3, 1, '2006-08-14'),
    (6, 1, '2016-04-13'),
    (10, 1, '2018-04-18'),
    (4, 1, '2021-08-28'),
    (10, 3, '2005-05-31'),
    (2, 2, '2005-07-14'),
    (10, 1, '2011-01-26'),
    (6, 1, '2017-07-26');

ALTER TABLE Sesion
DROP FOREIGN KEY Sesion_ibfk_1;

ALTER TABLE Sesion
ADD CONSTRAINT Sesion_ibfk_1
FOREIGN KEY (id_Cliente) REFERENCES Cliente(id)
ON DELETE CASCADE;

ALTER TABLE ClientePlan
DROP FOREIGN KEY ClientePlan_ibfk_1;

ALTER TABLE ClientePlan
ADD CONSTRAINT ClientePlan_ibfk_1
FOREIGN KEY (id_Cliente) REFERENCES Cliente(id)
ON DELETE CASCADE;



ALTER TABLE Sesion DROP FOREIGN KEY Sesion_ibfk_2;
ALTER TABLE Sesion
ADD CONSTRAINT Sesion_ibfk_2
FOREIGN KEY (id_Entrenador) REFERENCES Entrenador(id)
ON DELETE CASCADE;

```
### VISTAS

Creamos la carpeta **views** y dentro tenemos las siguientes carpetas con sus ficheros pug, que serán las vistas:

**Admin**
- _panel.pug_
  
**Cliente**
- _add.pug_
- _delete.pug_
- _edit.pug_
- _lista.pug_
- _mi.perfil_
- _registro.pug_

**ClientePlan**
- _lista.pug_

**Entrenador**
- _add.pug_
- _delete.pug_
- _edit.pug_
- _lista.pug_
- _sesion.pug_

**PlanMembresia**
- _lista.pug_

**Css**
- _estilos.css_

**Teplates**
- _footer.pug_
- _head.pug_
- _header.pug_
- _layout.pug_

En la misma carpeta **views**:
- _index.pug_
- _login.pug_
- _mensaje.pug_
- _register.pug_


### CRUD Cliente

| Verbo | Ruta | Acción |
|:-------:|:-------:|:------:|
| **GET**   | _/Cliente_ | Listar todos los clientes |
| **GET** | _/Cliente/add_ | Muestra el formulario para añadir un nuevo cliente |
| **POST** | _/Cliente/add_ | Añade un nuevo cliente a la base de datos |
| **GET** | _/Cliente/edit/:id_ | Muestra el formulario para editar el cliente con su id |
|**POST** | _/Cliente/edit/:id_ | Guarda la información modificada a la base de datos |
|**GET** | _/Cliente/delete/:id_ | Muestra el formulario para borrar un cliente |
|**POST**| _/Cliente/delete/:id_ | Elimina el cliente de la base de datos.|9


### CRUD ENTRENADOR
| Verbo | Ruta | Acción |
|:-----:|:----:|:------:|
| **GET** | _/Entrenador_ | Listar a todos los entrenadores| 
| **GET** | _/Entrenador/add_ | Muestra el formulario para añadir un entrenador|
| **POST** | _/Entrenador/add_ | Se añade un nuevo entrenador a la base de datos|
| **GET** | _Entrenador/edit/:id_ | Muestra el formulario para editar el cliente con su id |
| **POST** | _Entrenador/edit/:id_ | Guarda la información modificada en la base de datos|
| **GET** | _/Entrenador/delete/:id_ | Muestra el formulario para borrar el entrenador |
| **POST** | _/Entrenador/delete/:id_ | Eliminar al entrenador de la base de datos.|


### LOGUEO, USUARIOS, REGISTRO

Al ejecutar la aplicación nos saldrá el logueo y en caso de no tener ususario pulsaremos el botón registrar. Una vez guardado el ususario se podrá entrar en la aplicación.
Depende de que tipo de usuario seas _admin_, _cliente_, _entrenador_ tendrás un menú u otro.

_Vista del logueo:_
```pug
extends templates/layout

block content
    .container 
        h1 Login en el sistema
        form(action="/auth/login", method="post") 
            
            label.form-label(for="username") Nombre de Usuario
            input.form-control(type="text", name="username", id="username")
            br
            
            label.form-label(for="password") Contraseña
            input.form-control(type="password", name="password" id="password")
            br
            
            
            button.btn.btn-primary(type="submit") Iniciar sesión
            
        p ¿Sin usuario? Regístrese 
            a(href="/auth/register") aquí.
``` 

_Vista del registro:_
```pug
extends templates/layout
block content
    .container 
        h1 Alta en el sistema

        form.row.g-3(action="/auth/register", method="post") 
            
            .col-md-6
                label.form-label(for="username") Usuario
                input.form-control(type="text", name="username", id="username", required)

                label.form-label(for="password") Contraseña
                input.form-control(type="password", name="password" id="password", required)

                label.form-label(for="tipo") Tipo de usuario
                select.form-control(name="tipo", id="tipo", required)
                    option(value="ENTRENADOR") Entrenador
                    option(value="CLIENTE") Cliente
                    option(value="ADMIN") Admin

            .col-12
                button.btn.btn-success(type="submit") Registrarme
``` 

Si el usuario entra como **CLIENTE** se mostrará una vista para que se complete el registro del perfil, a continuacion un plan de Membresía a elegir, y una vista para ver los planes que tiene el usuario.

Si el usuario entra como **ENTRENADOR** se mostrará un listado de todos los entrenadores, con un crud, y un boton para ver las sesiones que tiene cada entrenador.

Si el usuario entra como **ADMIN** se mostrará el total de clientes, entrenadores, planes y sesiones.

### ROUTES Y CONTROLLER

Para que cada vista tenga un funcionamiento necesitamos una carpeta **routes**, con los métodos que se utilizarán en el controller.

_authRouter_
```java
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/register', authController.registerForm);

router.post('/register', authController.register);

router.get('/login', authController.loginForm);

router.post('/login', authController.login);

router.get('/logout', authController.logout);

module.exports=router;
``` 

_clientePlanRouter_
```java
const express = require('express');
const router = express.Router();
const clientePlanController = require('../controllers/clientePlanController');

router.get('/', clientePlanController.listarPlanesCliente);
router.post('/eliminar/:id', clientePlanController.eliminarPlan); 

module.exports = router;
```

_clienteRouter_
```java
const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

router.get('/', clienteController.clientes);

router.get('/add', clienteController.clienteAddFormulario);

router.post('/add', clienteController.clienteAdd);

router.get('/delete/:id', clienteController.clienteDelFormulario);

router.post('/delete/:id', clienteController.clienteDel);

router.get('/edit/:id', clienteController.clienteEditFormulario);

router.post('/edit/:id', clienteController.clienteEdit);

router.get('/mi-perfil', clienteController.miPerfil);

router.post('/mi-perfil', clienteController.actualizarPerfil);

router.post('/eliminar-perfil', clienteController.eliminarPerfil);

router.get('/registro', (req, res) => {
    res.render('Cliente/registro');
});

router.post('/registro', clienteController.registrarCliente);

module.exports = router;
```

_entrenadorRouter_
```java
const express = require('express');
const router = express.Router();
const entrenadorController = require('../controllers/entrenadorController');


router.get('/', entrenadorController.entrenadores);

router.get('/add', entrenadorController.entrenadorAddFormulario);

router.post('/add', entrenadorController.entrenadorAdd);

router.get('/delete/:id', entrenadorController.entrenadorDelFormulario);

router.post('/delete/:id', entrenadorController.entrenadorDel);

router.get('/edit/:id', entrenadorController.entrenadorEditFormulario);

router.post('/edit/:id', entrenadorController.entrenadorEdit);

router.get('/:id/sesion', entrenadorController.verSesionesEntrenador);

module.exports = router;
```

_planMembresiaRouter_
```java
const express = require('express');
const router = express.Router();
const planMembresiaController = require('../controllers/planMembresiaController'); // Asegúrate de importar correctamente el controlador

// Ruta para listar planes de membresía
router.get('/', planMembresiaController.listarPlanes);

// Ruta para asignar un plan
router.post('/asignar/:id_Plan', planMembresiaController.asignarPlan);

module.exports = router;
```

A continuación, se crea la carpeta controller con los métodos necesarios para su funcionamiento.
- _adminController_
- _authController_
- _clienteController_
- _clientePlanController_
- _entrenadorController_
- _planMembresiaController_

### APP Y DB

También hemos creado el archivo `app.js` en el proyecto base, para que al ejecutar el programa funcione.
```javascript
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const session = require('express-session');


// Configuración del archivo .env
dotenv.config({ path: './stack_gym/.env' });

// Importamos las rutas
const authRouter = require('./routes/authRouter');
const entrenadorRouter = require('./routes/entrenadorRouter');
const clienteRouter = require('./routes/clienteRouter');
const adminRouter = require('./routes/adminRouter');
const planMembresiaRouter = require('./routes/planMembresiaRouter');
const clientePlanRouter = require('./routes/clientePlanRouter');

// Inicializar la aplicación Express
const app = express();
const port = process.env.PORT || 3000;

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

// Agregar el usuario autenticado como variable local en las vistas
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Configuración de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Rutas
app.use('/auth', authRouter);
app.use('/Entrenador', entrenadorRouter);
app.use('/Cliente', clienteRouter);
app.use('/admin', adminRouter);
app.use('/Plan_Membresia', planMembresiaRouter);
app.use('/ClientePlan', clientePlanRouter);


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
```

Y otro fichero llamado `db.js` para conectarse a la base de datos.
```javascript
const mysql = require('mysql2'); 
const bcrypt = require('bcrypt');

require('dotenv').config({ path: 'stack_gym/.env' }); 

/**
 * Conectamos a la base de datos
 */
const db = mysql.createConnection({
    host:       process.env.MYSQL_HOST,
    port:       process.env.MYSQL_PORT,
    user:       process.env.MYSQL_USERNAME,
    password:   process.env.MYSQL_ROOT_PASSWORD,
    database:   process.env.MYSQL_DATABASE,
  });

db.connect(err => {
    if (err) {
      console.error(
        'Error al conectar a MySQL:', err);
      return;
    }
    console.log('Conexión exitosa a MySQL');
  });

module.exports=db;
```

### PARA EJECUTAR EL PROGRAMA, ¿QUÉ HAY QUE HACER?

Tenemos que estar en la carpeta donde está el docker:
`cd stack_gym`

Para que funcione tenemos que tener abierto la aplicación del Docker.
Una vez que estemos en esa carpeta ejecutamos el comando `docker-compose up -d`, y se nos crea los contenedores.

Hacemos un `cd..` para salirnos de la carpeta y ejecutamos `node app.js` para arrancar la aplicación, nos saldrá  la url del localhost con el puerto, es decir, `http://localhost:3000`.
