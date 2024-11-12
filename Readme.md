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
MYSQL_PASSWORD=zx76wbz7FG89k
MYSQL_USERNAME=root
MYSQL_PORT=33307
MYSQL_DATABASE=gimnasio
MYSQL_HOST=localhost
ADMINER_PORT=8182
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
  Fecha_Registro VARCHAR(200) NOT NULL, 
  Telefono INT NOT NULL
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
CREATE TABLE Sesion(
    id INT AUTO_INCREMENT PRIMARY KEY,
    Hora  TIME,
    Fecha DATE,
    Duracion_Minutos TIME,
    FOREIGN KEY (Cliente) REFERENCES Cliente(id),
    FOREIGN KEY (Entrenador) REFERENCES Entrenador(id)
);

--Tabla para ClientePlan
CREATE TABLE ClientePlan(
    id INT AUTO_INCREMENT PRIMARY KEY,
    FOREIGN KEY (Plan_Membresia) REFERENCES Plan_Membresia(id),
    Fecha_Inicio DATE
);
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

