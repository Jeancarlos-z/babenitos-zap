
-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS zapateria;
USE zapateria;

-- Tabla de roles
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT
);

-- Tabla de usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    correo VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL, -- contraseña hasheada
    rol_id INT NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rol_id) REFERENCES roles(id)
);

-- Tabla de áreas (áreas internas o zonas funcionales)
CREATE TABLE areas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT
);

-- Tabla de modelos (calzados)
CREATE TABLE modelos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    stock INT DEFAULT 0,
    precio DECIMAL(10, 2) NOT NULL,
    activo BOOLEAN DEFAULT TRUE
);

-- Tabla de clientes
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL,
    correo VARCHAR(100),
    telefono VARCHAR(20),
    direccion TEXT
);

-- Tabla de pedidos
CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    fecha_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('pendiente', 'en_produccion', 'completado', 'cancelado') DEFAULT 'pendiente',
    observaciones TEXT,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

-- Detalle del pedido (productos pedidos)
CREATE TABLE detalle_pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    modelo_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
    FOREIGN KEY (modelo_id) REFERENCES modelos(id)
);

-- Tabla de alertas (alertas operativas, stock bajo, etc.)
CREATE TABLE alertas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mensaje TEXT NOT NULL,
    tipo ENUM('stock', 'sistema', 'proceso') NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    leido BOOLEAN DEFAULT FALSE
);

-- Tabla de reportes (histórico de acciones o generados por el sistema)
CREATE TABLE reportes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    contenido TEXT,
    fecha_generado DATETIME DEFAULT CURRENT_TIMESTAMP,
    generado_por INT,
    FOREIGN KEY (generado_por) REFERENCES usuarios(id)
);

-- Tabla de problemas (incidencias o errores reportados)
CREATE TABLE problemas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descripcion TEXT NOT NULL,
    usuario_id INT,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    resuelto BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabla de comentarios (feedback sobre pedidos, productos o procesos)
CREATE TABLE comentarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    pedido_id INT,
    mensaje TEXT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
);

-- Insertar roles iniciales
INSERT INTO roles (nombre, descripcion) VALUES
('Administrador', 'Acceso completo al sistema'),
('Producción', 'Gestión de pedidos y modelos'),
('Ventas', 'Gestión de clientes y pedidos');

-- Insertar usuario administrador
INSERT INTO usuarios (nombre_completo, usuario, correo, contrasena, rol_id) VALUES
('Administrador General', 'admin', 'admin@zapateria.com', 
'$2b$12$ExAMPLEHASH12345678901234567890123456789012345678901234567890', 1);
-- Nota: la contraseña debe ser encriptada, ese es solo un ejemplo de hash bcrypt

use zapateria;
UPDATE usuarios
SET contrasena = '74561234'
WHERE usuario = 'admin';

USE zapateria;

SELECT usuario, contrasena, activo FROM usuarios WHERE usuario = 'admin';



use zapateria;
-- Insertar más roles si aún no lo hiciste
INSERT INTO roles (nombre, descripcion) VALUES
('Gerente', 'Acceso gerencial'),
('Área', 'Supervisión de estados');

-- Usuario adicional: Producción
INSERT INTO usuarios (nombre_completo, usuario, correo, contrasena, rol_id) VALUES
('Carlos Producción', 'produccion1', 'produccion@zapateria.com',
'$2b$12$KSCZIRHc6OQh3NaHNjxOF.LS8YZBYspgEsEED27eM/U/IiGLcO0A2', 2);
-- contraseña: 98765432

INSERT INTO clientes (nombre_completo, correo, telefono, direccion) VALUES
('Juan Pérez', 'juan.perez@gmail.com', '987654321', 'Av. Principal 123'),
('Ana Gómez', 'ana.gomez@gmail.com', '912345678', 'Calle Secundaria 456');

INSERT INTO modelos (nombre, descripcion, stock, precio) VALUES
('Zapatilla Deportiva', 'Modelo liviano para entrenamiento', 50, 120.50),
('Botín de Cuero', 'Calzado formal con cuero natural', 30, 250.00);


