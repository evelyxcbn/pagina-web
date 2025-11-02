COMMENT ON DATABASE tienda_este IS 'Nodo regional - Campus Este';
GRANT CONNECT ON DATABASE tienda_este TO tienda_user;

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
CREATE INDEX idx_productos_region_este ON productos(region);
CREATE INDEX idx_productos_activo_este ON productos(activo);
CREATE INDEX idx_clientes_email_este ON clientes(email);
CREATE INDEX idx_pedidos_fecha_este ON pedidos(fecha_pedido);
CREATE INDEX idx_pedidos_estado_este ON pedidos(estado);


INSERT INTO categorias (nombre, descripcion) VALUES
('Ropa Este', 'Playeras, gorras y uniformes región este'),
('Accesorios Este', 'Mochilas, llaveros y accesorios este'),
('Papelería Este', 'Cuadernos, lapiceras y material este'),
('Electrónicos Este', 'Dispositivos electrónicos campus este'),
('Libros Este', 'Material educativo y libros región este');

INSERT INTO productos (nombre, descripcion, precio, imagen_url, categoria_id, stock, region) VALUES
('Playera Este Limited', 'Playera edición limitada este - diseño exclusivo', 260.00, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', 1, 22, 'este'),
('Gorra Este Signature', 'Gorra firma campus este - edición especial', 190.00, 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b', 1, 28, 'este'),
('Mochila Executive Este', 'Mochila ejecutiva este - profesional y elegante', 480.00, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62', 2, 14, 'este'),
('Calculadora Científica', 'Calculadora científica avanzada - región este', 350.00, 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea', 4, 35, 'este'),
('Set Geometría Este', 'Set completo de geometría profesional', 120.00, 'https://images.unsplash.com/photo-1588444650700-6c7f0c89d36b', 3, 45, 'este'),
('Tablet Drawing Este', 'Tablet para diseño y dibujo - especial este', 1500.00, 'https://images.unsplash.com/photo-1542751110-97427bbecf20', 4, 8, 'este'),
('Libro Programación', 'Libro de programación avanzada - edición este', 280.00, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c', 5, 30, 'este'),
('Smartwatch Estudiantil', 'Smartwatch para estudiantes - funciones educativas', 650.00, 'https://images.unsplash.com/photo-1546868871-7041f2a55e12', 4, 18, 'este');

INSERT INTO clientes (nombre_completo, email, telefono, direccion, ciudad, codigo_postal, region) VALUES
('David Fernando Reyes Castillo', 'david.reyes@email.com', '555-345-6789', 'Av. Este 345, Col. Moderna', 'Ciudad Este', '30000', 'este'),
('Sofia Alejandra Mendoza Vargas', 'sofia.mendoza@email.com', '555-456-7890', 'Calle Oriente 678, Col. Jardines', 'Ciudad Este', '30010', 'este'),
('Miguel Ángel Ortega Pérez', 'miguel.ortega@email.com', '555-567-8901', 'Bosques del Este 901, Col. Bosques', 'Ciudad Este', '30020', 'este'),
('Gabriela Romero Sánchez', 'gabriela.romero@email.com', '555-678-9012', 'Av. Tecnológico 234, Col. Innovación', 'Ciudad Este', '30030', 'este'),
('Ricardo Jiménez Cruz', 'ricardo.jimenez@email.com', '555-789-0123', 'Calle Universidad 567, Col. Estudios', 'Ciudad Este', '30040', 'este');

INSERT INTO pedidos (numero_pedido, cliente_id, region_cliente, subtotal, iva, total, direccion_envio, metodo_pago, estado_pago, region_venta) VALUES
('EST-2024-0001', 1, 'este', 450.00, 72.00, 522.00, 'Av. Este 345, Col. Moderna, Ciudad Este', 'tarjeta_credito', 'pagado', 'este'),
('EST-2024-0002', 2, 'este', 830.00, 132.80, 962.80, 'Calle Oriente 678, Col. Jardines, Ciudad Este', 'paypal', 'pagado', 'este'),
('EST-2024-0003', 3, 'este', 1200.00, 192.00, 1392.00, 'Bosques del Este 901, Col. Bosques, Ciudad Este', 'transferencia', 'pendiente', 'este');

INSERT INTO detalles_pedido (pedido_id, producto_id, region_venta, cantidad, precio_unitario, subtotal) VALUES
(1, 1, 'este', 1, 260.00, 260.00),
(1, 2, 'este', 1, 190.00, 190.00),
(2, 4, 'este', 1, 350.00, 350.00),
(2, 5, 'este', 2, 120.00, 240.00),
(2, 7, 'este', 1, 280.00, 280.00),
(3, 6, 'este', 1, 1500.00, 1500.00);

INSERT INTO inventario (producto_id, stock_actual, stock_minimo, stock_maximo, ubicacion) VALUES
(1, 22, 5, 40, 'Almacén Este - Sección A'),
(2, 28, 5, 35, 'Almacén Este - Sección A'),
(3, 14, 3, 25, 'Almacén Este - Sección B'),
(4, 35, 5, 50, 'Almacén Este - Sección C'),
(5, 45, 8, 80, 'Almacén Este - Sección D'),
(6, 8, 2, 15, 'Almacén Este - Sección E'),
(7, 30, 5, 60, 'Almacén Este - Sección F'),
(8, 18, 3, 30, 'Almacén Este - Sección G');