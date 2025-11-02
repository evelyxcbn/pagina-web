COMMENT ON DATABASE tienda_norte IS 'Nodo regional - Campus Norte';
GRANT CONNECT ON DATABASE tienda_norte TO tienda_user;

-- TABLES FOR NORTH REGION NODE
-- Execute in: tienda_norte

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

CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    numero_pedido VARCHAR(50) UNIQUE NOT NULL,
    cliente_id INTEGER REFERENCES clientes(id),
    region_cliente VARCHAR(20) NOT NULL,
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(50) DEFAULT 'pendiente',
    subtotal DECIMAL(10,2) NOT NULL,
    iva DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    direccion_envio TEXT,
    metodo_pago VARCHAR(100),
    estado_pago VARCHAR(50) DEFAULT 'pendiente',
    region_venta VARCHAR(20) NOT NULL
);

CREATE TABLE detalles_pedido (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER REFERENCES pedidos(id),
    producto_id INTEGER REFERENCES productos(id),
    region_venta VARCHAR(20) NOT NULL,
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL
);


INSERT INTO categorias (nombre, descripcion) VALUES
('Ropa Norte', 'Prendas exclusivas de la región norte'),
('Accesorios Norte', 'Accesorios y complementos estilo norte'),
('Papelería Norte', 'Material de oficina y escolar norteño');

INSERT INTO productos (nombre, descripcion, precio, imagen_url, categoria_id, stock, region) VALUES
('Playera Norte Premium', 'Playera de algodón 100% premium, edición norte', 250.00, 'https://example.com/norte-playera.jpg', 1, 30, 'norte'),
('Gorra Norte Edition', 'Gorra ajustable con diseño exclusivo norte', 180.00, 'https://example.com/norte-gorra.jpg', 1, 25, 'norte'),
('Mochila Trekking Norte', 'Mochila resistente para expediciones norteñas', 450.00, 'https://example.com/norte-mochila.jpg', 1, 15, 'norte'),
('Lapicera Norte', 'Set de lapiceras con motivos norteños', 85.00, 'https://example.com/norte-lapicera.jpg', 3, 50, 'norte'),
('Cuaderno Norte', 'Cuaderno profesional región norte', 70.00, 'https://example.com/norte-cuaderno.jpg', 3, 40, 'norte');

INSERT INTO clientes (nombre_completo, email, telefono, direccion, ciudad, codigo_postal, region) VALUES
('Carlos Hernández García', 'carlos.hernandez@email.com', '555-123-4567', 'Av. Norte 123, Col. Industrial', 'Ciudad Norte', '28000', 'norte'),
('Ana María López Ruiz', 'ana.lopez@email.com', '555-987-6543', 'Calle Central 456, Centro', 'Ciudad Norte', '28010', 'norte'),
('Roberto Sánchez Méndez', 'roberto.sanchez@email.com', '555-456-7890', 'Jardines del Valle 789', 'Ciudad Norte', '28020', 'norte');