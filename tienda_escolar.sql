
CREATE DATABASE tienda_clientes;
CREATE DATABASE tienda_productos;


CREATE EXTENSION IF NOT EXISTS postgres_fdw;


CREATE SERVER nodo_clientes
FOREIGN DATA WRAPPER postgres_fdw
OPTIONS (host 'localhost', dbname 'tienda_clientes', port '5432');

CREATE SERVER nodo_productos
FOREIGN DATA WRAPPER postgres_fdw
OPTIONS (host 'localhost', dbname 'tienda_productos', port '5432');


CREATE USER MAPPING FOR postgres
SERVER nodo_clientes
OPTIONS (user 'postgres', password 'Hobimore188');

CREATE USER MAPPING FOR postgres
SERVER nodo_productos
OPTIONS (user 'postgres', password 'Hobimore188');


CREATE FOREIGN TABLE clientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    direccion TEXT
) SERVER nodo_clientes
OPTIONS (schema_name 'public', table_name 'clientes');

-- Tabla productos en nodo_productos
CREATE FOREIGN TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio NUMERIC(10,2) NOT NULL,
    stock INT NOT NULL,
    activo BOOLEAN DEFAULT TRUE
) SERVER nodo_productos
OPTIONS (schema_name 'public', table_name 'productos');

CREATE FOREIGN TABLE ventas (
    id SERIAL PRIMARY KEY,
    cliente_id INT NOT NULL,
    numero_pedido VARCHAR(20) NOT NULL,
    total NUMERIC(10,2) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) SERVER nodo_productos
OPTIONS (schema_name 'public', table_name 'ventas');

CREATE FOREIGN TABLE detalle_venta (
    id SERIAL PRIMARY KEY,
    venta_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario NUMERIC(10,2) NOT NULL,
    subtotal NUMERIC(10,2) NOT NULL
) SERVER nodo_productos
OPTIONS (schema_name 'public', table_name 'detalle_venta');


\c tienda_clientes;

CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    direccion TEXT
);


\c tienda_productos;

CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio NUMERIC(10,2) NOT NULL,
    stock INT NOT NULL,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE ventas (
    id SERIAL PRIMARY KEY,
    cliente_id INT NOT NULL,
    numero_pedido VARCHAR(20) NOT NULL,
    total NUMERIC(10,2) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE detalle_venta (
    id SERIAL PRIMARY KEY,
    venta_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario NUMERIC(10,2) NOT NULL,
    subtotal NUMERIC(10,2) NOT NULL
);

INSERT INTO productos (nombre, descripcion, precio, stock) VALUES
('Cuaderno A4', 'Cuaderno rayado 100 hojas', 25.50, 100),
('Lapicero Azul', 'Lapicero tinta azul', 5.00, 200),
('Mochila Escolar', 'Mochila con compartimentos', 450.00, 50);

INSERT INTO clientes (nombre, email, telefono, direccion) VALUES
('Juan Pérez', 'juanperez@mail.com', '5512345678', 'Calle 123, Ciudad'),
('Ana López', 'analopez@mail.com', '5598765432', 'Avenida 45, Ciudad');

