# Proyecto Tema 2 Gimnasio
## Eduardo Díaz y María López


En primer lugar, creamos una carpeta y dentro de ella se ejecuta:
 `npm install express express-session mysql2 pug body-parser dotenv`

 Se crean dos ficheros y una carpeta:
 - package-lock.json
 - package.json
 - node_modules
  
Creamos el fichero _.gitignore_ que contiene
```bash
node_modules
package-lock.json
.env
``` 

Y hacemos un _git init_, que nos creará un nuevo repositorio git.

Hemos creado una carpeta llamada *stack_gym* que contiene el **docker-compose.yml**, el **.env** y una carpeta **script** con un fichero **initdb.sql** que contendrá las tablas.

docker-compose.yml
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

.env
```bash
MYSQL_ROOT_PASSWORD = zx76wbz7FG89k
MYSQL_USERNAME=root
MYSQL_PORT=33307
MYSQL_DATABASE=gimnasio
MYSQL_HOST=localhost
ADMINER_PORT= 8182
```

Fichero initdb.sql para crear las tablas 
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


CREATE TABLE IF NOT EXISTS users(
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `enabled`BOOL,
  tipo ENUM('ENTRENADOR', 'CLIENTE', 'ADMIN'),
  Cliente INT REFERENCES Cliente(id),
  Entrenador INT REFERENCES Enternador(id)
);

INSERT INTO `users` (`username`, `password`, `enabled`, `tipo`)
  VALUES ('pepe', 'Secreto_123', 'ENTRENADOR');


-- Tabla para ClientePlan
CREATE TABLE ClientePlan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_Cliente INT,
    id_Plan INT,
    Fecha_Inicio DATE,
    FOREIGN KEY (id_Cliente) REFERENCES Cliente(id),
    FOREIGN KEY (id_Plan) REFERENCES Plan_Membresia(id)
);




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
INSERT INTO `Entrenador`(`id`, `Nombre`, `Especialidad`, `Nivel_Experiencia`)
  VALUES
    (1, 'Lucía', 'Crossfit', 'Intermedio'),
    (2, 'José', 'Pesas', 'Avanzado'),
    (3, 'María', 'Crossfit', 'Avanzado'),
    (4, 'Lucía', 'Crossfit', 'Intermedio'),
    (5, 'Carlos', 'Pesas', 'Principiante');


-- Insertar datos en Plan_Membresia
INSERT INTO `Plan_Membresia`(`id`, `Nombre_Plan`, `Duracion_Meses`, `Costo`)
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

```

Creamos la carpeta **views** y dentro tenemos las siguientes carpetas con sus ficheros pug, que serán las vistas:

**CLIENTE**
- _add.pug_
- _delete.pug_
- _edit.pug_
- _lista.pug_

**ENTRENADOR**
- _add.pug_
- _delete.pug_
- _edit.pug_
- _lista.pug_

**PLAN_MEMBRESIA**
- _add.pug_
- _delete.pug_
- _edit.pug_
- _lista.pug_



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

