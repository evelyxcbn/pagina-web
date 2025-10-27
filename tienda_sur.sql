COMMENT ON DATABASE tienda_sur IS 'Nodo regional - Campus Sur';
GRANT CONNECT ON DATABASE tienda_sur TO tienda_user;


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

CREATE TABLE inventario (
    id SERIAL PRIMARY KEY,
    producto_id INTEGER REFERENCES productos(id),
    stock_actual INTEGER DEFAULT 0,
    stock_minimo INTEGER DEFAULT 5,
    stock_maximo INTEGER DEFAULT 100,
    ubicacion VARCHAR(100),
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejor rendimiento
CREATE INDEX idx_productos_region_sur ON productos(region);
CREATE INDEX idx_productos_activo_sur ON productos(activo);
CREATE INDEX idx_clientes_email_sur ON clientes(email);
CREATE INDEX idx_pedidos_fecha_sur ON pedidos(fecha_pedido);
CREATE INDEX idx_pedidos_estado_sur ON pedidos(estado);
INSERT INTO categorias (nombre, descripcion) VALUES
('Ropa Sur', 'Prendas exclusivas de la región sur'),
('Accesorios Sur', 'Accesorios y complementos estilo sur'),
('Electrónicos Sur', 'Dispositivos electrónicos región sur');

INSERT INTO productos (nombre, descripcion, precio, imagen_url, categoria_id, stock, region) VALUES
('Playera Sur Premium', 'Playera de algodón 100% premium, edición sur', 240.00, 'https://example.com/sur-playera.jpg', 1, 28, 'sur'),
('Gorra Sur Collection', 'Gorra ajustable con diseño colección sur', 170.00, 'https://example.com/sur-gorra.jpg', 1, 32, 'sur'),
('Mochila Urbana Sur', 'Mochila urbana estilo sur', 420.00, 'https://example.com/sur-mochila.jpg', 1, 18, 'sur'),
('Laptop Stand Sur', 'Soporte para laptop diseño sur', 320.00, 'https://example.com/sur-stand.jpg', 3, 20, 'sur'),
('Tablet Sur', 'Tablet para estudiantes región sur', 1200.00, 'https://example.com/sur-tablet.jpg', 3, 12, 'sur');

INSERT INTO clientes (nombre_completo, email, telefono, direccion, ciudad, codigo_postal, region) VALUES
('María Elena Castro', 'maria.castro@email.com', '555-234-5678', 'Av. Sur 234, Col. Centro', 'Ciudad Sur', '29000', 'sur'),
('Jorge Alberto Díaz', 'jorge.diaz@email.com', '555-345-6789', 'Calle Jardín 567', 'Ciudad Sur', '29010', 'sur'),
('Laura Patricia Morales', 'laura.morales@email.com', '555-456-7891', 'Residencial Sur 890', 'Ciudad Sur', '29020', 'sur');

INSERT INTO pedidos (numero_pedido, cliente_id, region_cliente, subtotal, iva, total, direccion_envio, metodo_pago, estado_pago, region_venta) VALUES
('SUR-2024-0001', 1, 'sur', 410.00, 65.60, 475.60, 'Av. Sur 234, Col. Centro, Ciudad Sur', 'tarjeta_credito', 'pagado', 'sur'),
('SUR-2024-0002', 2, 'sur', 690.00, 110.40, 800.40, 'Calle Jardín 567, Col. Residencial, Ciudad Sur', 'transferencia', 'pagado', 'sur'),
('SUR-2024-0003', 3, 'sur', 240.00, 38.40, 278.40, 'Residencial Sur 890, Col. Las Flores, Ciudad Sur', 'efectivo', 'pendiente', 'sur');

INSERT INTO detalles_pedido (pedido_id, producto_id, region_venta, cantidad, precio_unitario, subtotal) VALUES
(1, 1, 'sur', 1, 240.00, 240.00),
(1, 2, 'sur', 1, 170.00, 170.00),
(2, 3, 'sur', 1, 420.00, 420.00),
(2, 6, 'sur', 2, 75.00, 150.00),
(2, 7, 'sur', 1, 90.00, 90.00),
(3, 1, 'sur', 1, 240.00, 240.00);

-- Insertar registros de inventario SUR
INSERT INTO inventario (producto_id, stock_actual, stock_minimo, stock_maximo, ubicacion) VALUES
(1, 28, 5, 50, 'Almacén A - Estante 1'),
(2, 32, 5, 40, 'Almacén A - Estante 2'),
(3, 18, 3, 30, 'Almacén B - Estante 1'),
(4, 20, 2, 25, 'Almacén C - Estante 1'),
(5, 12, 2, 20, 'Almacén C - Estante 2'),
(6, 60, 10, 100, 'Almacén D - Estante 1'),
(7, 45, 8, 80, 'Almacén D - Estante 2'),
(8, 25, 5, 40, 'Almacén E - Estante 1');
