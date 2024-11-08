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