-- TABLAS PARA NODO REGIONAL NORTE

CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    imagen_url VARCHAR(500),
    categoria_id INTEGER REFERENCES categorias(id),
    stock INTEGER DEFAULT 0,
    stock_minimo INTEGER DEFAULT 5,
    region VARCHAR(20) DEFAULT 'norte',
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(200) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    direccion TEXT,
    ciudad VARCHAR(100),
    codigo_postal VARCHAR(10),
    region VARCHAR(20) DEFAULT 'norte',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT true
);

SELECT 'Tablas del nodo norte creadas correctamente' as estado;

-- DATOS DE PRUEBA PARA NODO NORTE

INSERT INTO categorias (nombre, descripcion) VALUES
('Ropa Norte', 'Prendas exclusivas de la región norte'),
('Accesorios Norte', 'Accesorios y complementos norte'),
('Papelería Norte', 'Material educativo región norte');

INSERT INTO productos (nombre, descripcion, precio, imagen_url, categoria_id, stock, region) VALUES
('Playera Norte Premium', 'Playera de algodón premium edición norte', 250.00, 'https://ejemplo.com/norte1.jpg', 1, 30, 'norte'),
('Gorra Norte Edition', 'Gorra ajustable edición especial norte', 180.00, 'https://ejemplo.com/norte2.jpg', 1, 25, 'norte'),
('Mochila Trekking Norte', 'Mochila resistente para expediciones norteñas', 450.00, 'https://ejemplo.com/norte3.jpg', 2, 15, 'norte'),
('Cuaderno Profesional Norte', 'Cuaderno profesional 200 hojas región norte', 75.00, 'https://ejemplo.com/norte4.jpg', 3, 60, 'norte');

INSERT INTO clientes (nombre_completo, email, telefono, direccion, ciudad, codigo_postal, region) VALUES
('Carlos Hernández García', 'carlos.hernandez@email.com', '555-123-4567', 'Av. Norte 123, Col. Industrial', 'Ciudad Norte', '28000', 'norte'),
('Ana María López Ruiz', 'ana.lopez@email.com', '555-987-6543', 'Calle Central 456, Centro', 'Ciudad Norte', '28010', 'norte');

SELECT 'Datos de prueba del nodo norte insertados correctamente' as estado;

SELECT 'NODO NORTE CONFIGURADO EXITOSAMENTE' as resultado_final;
SELECT COUNT(*) as total_productos FROM productos;
SELECT COUNT(*) as total_clientes FROM clientes;