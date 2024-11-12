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
CREATE TABLE Sesion(
    id INT AUTO_INCREMENT PRIMARY KEY,
    Hora  TIME,
    Fecha DATE,
    Duracion_Minutos INT,
    FOREIGN KEY (id_Cliente) REFERENCES Cliente(id),
    FOREIGN KEY (id_Entrenador) REFERENCES Entrenador(id)
);

--Tabla para ClientePlan
CREATE TABLE ClientePlan(
    FOREIGN KEY (id_Cliente) REFERENCES Cliente(id),
    FOREIGN KEY (id_Plan) REFERENCES Plan_Membresia(id),
    Fecha_Inicio DATE
);



--para que los acentos salgan bien
SET NAME utf8mb4;



-- Insertar datos en Cliente
INSERT INTO `Cliente` (`id`,`Nombre`, `Correo`, `Fecha_Registro`, `Telefono`)
  VALUES
    (1, 'Luis', 'cliente1@gymcorreo.com', 'cliente1@gymcorreo.com', '555-6983'),
    (2, 'Sofia', 'cliente2@gymcorreo.com', '3/23/2016', '555-6896'),
    (3, 'Ana', 'cliente3@gymcorreo.com', '2/2/2016', '555-6864'),
    (4, 'Ana', 'cliente4@gymcorreo.com', '2/15/2008', '555-4611'),
    (5, 'Sofia', 'cliente5@gymcorreo.com', '1/7/2010', '555-1593'),
    (6, 'Luis', 'cliente6@gymcorreo.com', '5/28/2013', '555-1116'),
    (7, 'Sofia', 'cliente7@gymcorreo.com', '5/4/2008', '555-2996'),
    (8, 'José', 'cliente8@gymcorreo.com', '6/26/1992', '555-9572'),
    (9, 'Lucía', 'cliente9@gymcorreo.com', '9/6/2019', '555-3335'),
    (10, 'María', 'cliente10@gymcorreo.com', '9/22/1990', '555-7920');


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
INSERT INTO `Sesion` (`id`, `Hora`, `Fecha`, `Duracion_Minutos`, `id_Cliente`, `id_Entrenador`)
  VALUES 
    (1, '12/1/2000', '05:00:00', 45, 8, 2),
    (2, '12/14/1991', '09:00:00', 45, 4, 3),
    (3, '5/26/2021', '10:00:00', 45, 6, 5),
    (4, '5/5/2011', '11:00:00', 60, 9, 4),
    (5, '9/23/2007', '09:00:00', 30, 8, 1),
    (6, '9/29/2005', '09:00:00', 90, 6, 1),
    (7, '8/30/2008', '03:00:00', 45, 8, 3),
    (8, '10/2/2005', '07:00:00', 90, 9, 4),
    (9, '4/12/2011', '11:00:00', 60, 5, 3),
    (10, '1/9/2001', '12:00:00', 60, 5, 3),
    (11, '3/4/1999', '08:00:00', 30, 8, 2),
    (12, '8/5/2001', '07:00:00', 30, 8, 5),
    (13, '12/28/1991', '03:00:00', 90, 6, 1),
    (14, '11/6/1996', '08:00:00', 90, 9, 3),
    (15, '3/23/2000', '04:00:00', 45, 1, 1);



-- Insertar datos en ClientePlan
INSERT INTO `ClientePlan` (`id_Cliente`, `id_Plan`, `Fecha_Inicio`)
  VALUES 
    (3, 1, '11/8/2005'),
    (9, 3, '7/3/1998'),
    (2, 1, '1/26/2021'), 
    (2, 1, '10/28/1995'),
    (3, 3, '9/21/2003'),
    (9, 1, '9/21/2016'),
    (9, 1, '12/23/2020'),
    (3, 1, '8/14/2006'),
    (6, 1, '4/13/2016'),
    (10, 1, '4/18/2018'),
    (4, 1, '8/28/2021'),
    (10, 3, '5/31/2005'),
    (2, 2, '7/14/2005'),
    (10, 1, '1/26/2011'),
    (6, 1, '7/26/2017');



