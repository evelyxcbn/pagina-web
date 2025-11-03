-- TABLAS PARA NODO REGIONAL ESTE

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
    region VARCHAR(20) DEFAULT 'este',
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
    region VARCHAR(20) DEFAULT 'este',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT true
);

SELECT 'Tablas del nodo este creadas correctamente' as estado;

-- DATOS DE PRUEBA PARA NODO ESTE

INSERT INTO categorias (nombre, descripcion) VALUES
('Ropa Este', 'Prendas exclusivas de la región este'),
('Accesorios Este', 'Accesorios y complementos este'),
('Libros Este', 'Material educativo región este');

INSERT INTO productos (nombre, descripcion, precio, imagen_url, categoria_id, stock, region) VALUES
('Playera Este Limited', 'Playera edición limitada este', 260.00, 'https://ejemplo.com/este1.jpg', 1, 22, 'este'),
('Gorra Este Signature', 'Gorra firma campus este', 190.00, 'https://ejemplo.com/este2.jpg', 1, 28, 'este'),
('Mochila Executive Este', 'Mochila ejecutiva este', 480.00, 'https://ejemplo.com/este3.jpg', 2, 14, 'este'),
('Calculadora Científica', 'Calculadora científica región este', 350.00, 'https://ejemplo.com/este4.jpg', 3, 35, 'este');

INSERT INTO clientes (nombre_completo, email, telefono, direccion, ciudad, codigo_postal, region) VALUES
('David Fernando Reyes Castillo', 'david.reyes@email.com', '555-345-6789', 'Av. Este 345, Col. Moderna', 'Ciudad Este', '30000', 'este'),
('Sofia Alejandra Mendoza Vargas', 'sofia.mendoza@email.com', '555-456-7890', 'Calle Oriente 678, Col. Jardines', 'Ciudad Este', '30010', 'este');

SELECT 'Datos de prueba del nodo este insertados correctamente' as estado;

SELECT 'NODO ESTE CONFIGURADO EXITOSAMENTE' as resultado_final;
SELECT COUNT(*) as total_productos FROM productos;
SELECT COUNT(*) as total_clientes FROM clientes;