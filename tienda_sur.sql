-- TABLAS PARA NODO REGIONAL SUR

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
    region VARCHAR(20) DEFAULT 'sur',
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
    region VARCHAR(20) DEFAULT 'sur',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT true
);

SELECT 'Tablas del nodo sur creadas correctamente' as estado;

-- DATOS DE PRUEBA PARA NODO SUR

INSERT INTO categorias (nombre, descripcion) VALUES
('Ropa Sur', 'Prendas exclusivas de la región sur'),
('Accesorios Sur', 'Accesorios y complementos sur'),
('Electrónicos Sur', 'Dispositivos electrónicos región sur');

INSERT INTO productos (nombre, descripcion, precio, imagen_url, categoria_id, stock, region) VALUES
('Playera Sur Premium', 'Playera de algodón premium edición sur', 240.00, 'https://ejemplo.com/sur1.jpg', 1, 28, 'sur'),
('Gorra Sur Collection', 'Gorra ajustable colección sur', 170.00, 'https://ejemplo.com/sur2.jpg', 1, 32, 'sur'),
('Mochila Urbana Sur', 'Mochila urbana estilo sur', 420.00, 'https://ejemplo.com/sur3.jpg', 2, 18, 'sur'),
('Tablet Educativa Sur', 'Tablet para estudiantes región sur', 1200.00, 'https://ejemplo.com/sur4.jpg', 3, 12, 'sur');

INSERT INTO clientes (nombre_completo, email, telefono, direccion, ciudad, codigo_postal, region) VALUES
('María Elena Castro Rodríguez', 'maria.castro@email.com', '555-234-5678', 'Av. Sur 234, Col. Centro', 'Ciudad Sur', '29000', 'sur'),
('Jorge Alberto Díaz Mendoza', 'jorge.diaz@email.com', '555-345-6789', 'Calle Jardín 567, Col. Residencial', 'Ciudad Sur', '29010', 'sur');

SELECT 'Datos de prueba del nodo sur insertados correctamente' as estado;

SELECT 'NODO SUR CONFIGURADO EXITOSAMENTE' as resultado_final;
SELECT COUNT(*) as total_productos FROM productos;
SELECT COUNT(*) as total_clientes FROM clientes;