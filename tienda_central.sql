COMMENT ON DATABASE tienda_central IS 'Nodo coordinador - Base de datos central';

CREATE USER tienda_user WITH PASSWORD 'Tienda2024!';
GRANT CONNECT ON DATABASE tienda_central TO tienda_user;

CREATE EXTENSION IF NOT EXISTS postgres_fdw;

-- Servidores para nodos regionales
CREATE SERVER norte_node FOREIGN DATA WRAPPER postgres_fdw
OPTIONS (host 'localhost', dbname 'tienda_norte', port '5432');

CREATE SERVER sur_node FOREIGN DATA WRAPPER postgres_fdw
OPTIONS (host 'localhost', dbname 'tienda_sur', port '5432');

CREATE SERVER este_node FOREIGN DATA WRAPPER postgres_fdw
OPTIONS (host 'localhost', dbname 'tienda_este', port '5432');

-- Mapeo de usuarios
CREATE USER MAPPING FOR tienda_user SERVER norte_node 
OPTIONS (user 'tienda_user', password 'Tienda2024!');

CREATE USER MAPPING FOR tienda_user SERVER sur_node 
OPTIONS (user 'tienda_user', password 'Tienda2024!');

CREATE USER MAPPING FOR tienda_user SERVER este_node 
OPTIONS (user 'tienda_user', password 'Tienda2024!');

CREATE SCHEMA IF NOT EXISTS norte;
CREATE SCHEMA IF NOT EXISTS sur;
CREATE SCHEMA IF NOT EXISTS este;
CREATE SCHEMA IF NOT EXISTS global;
CREATE SCHEMA IF NOT EXISTS replicas;

COMMENT ON SCHEMA norte IS 'Esquema para particiones del nodo norte';
COMMENT ON SCHEMA sur IS 'Esquema para particiones del nodo sur';
COMMENT ON SCHEMA este IS 'Esquema para particiones del nodo este';
COMMENT ON SCHEMA global IS 'Esquema para tablas y vistas globales';
COMMENT ON SCHEMA replicas IS 'Esquema para tablas replicadas en todos los nodos';

-- Tabla productos distribuida
CREATE TABLE global.productos (
    id SERIAL,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    imagen_url VARCHAR(500),
    categoria_id INTEGER,
    stock INTEGER DEFAULT 0,
    stock_minimo INTEGER DEFAULT 5,
    region VARCHAR(20) NOT NULL,
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id, region)
) PARTITION BY LIST (region);

-- Particiones para cada región
CREATE TABLE norte.productos PARTITION OF global.productos FOR VALUES IN ('norte');
CREATE TABLE sur.productos PARTITION OF global.productos FOR VALUES IN ('sur');
CREATE TABLE este.productos PARTITION OF global.productos FOR VALUES IN ('este');

-- Tabla clientes distribuida
CREATE TABLE global.clientes (
    id SERIAL,
    nombre_completo VARCHAR(200) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telefono VARCHAR(20),
    direccion TEXT,
    ciudad VARCHAR(100),
    codigo_postal VARCHAR(10),
    region VARCHAR(20) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT true,
    PRIMARY KEY (id, region)
) PARTITION BY LIST (region);

CREATE TABLE norte.clientes PARTITION OF global.clientes FOR VALUES IN ('norte');
CREATE TABLE sur.clientes PARTITION OF global.clientes FOR VALUES IN ('sur');
CREATE TABLE este.clientes PARTITION OF global.clientes FOR VALUES IN ('este');

-- Tabla pedidos distribuida
CREATE TABLE global.pedidos (
    id SERIAL,
    numero_pedido VARCHAR(50) NOT NULL,
    cliente_id INTEGER,
    region_cliente VARCHAR(20) NOT NULL,
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(50) DEFAULT 'pendiente',
    subtotal DECIMAL(10,2) NOT NULL,
    iva DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    direccion_envio TEXT,
    metodo_pago VARCHAR(100),
    estado_pago VARCHAR(50) DEFAULT 'pendiente',
    region_venta VARCHAR(20) NOT NULL,
    PRIMARY KEY (id, region_venta)
) PARTITION BY LIST (region_venta);

CREATE TABLE norte.pedidos PARTITION OF global.pedidos FOR VALUES IN ('norte');
CREATE TABLE sur.pedidos PARTITION OF global.pedidos FOR VALUES IN ('sur');
CREATE TABLE este.pedidos PARTITION OF global.pedidos FOR VALUES IN ('este');



-- Foreign tables para productos
CREATE FOREIGN TABLE norte.productos_ft (
    id INTEGER, 
    nombre VARCHAR(200), 
    descripcion TEXT, 
    precio DECIMAL(10,2), 
    imagen_url VARCHAR(500), 
    categoria_id INTEGER,
    stock INTEGER, 
    region VARCHAR(20), 
    activo BOOLEAN, 
    fecha_creacion TIMESTAMP
) SERVER norte_node OPTIONS (schema_name 'public', table_name 'productos');

CREATE FOREIGN TABLE sur.productos_ft (
    id INTEGER, 
    nombre VARCHAR(200), 
    descripcion TEXT, 
    precio DECIMAL(10,2), 
    imagen_url VARCHAR(500), 
    categoria_id INTEGER,
    stock INTEGER, 
    region VARCHAR(20), 
    activo BOOLEAN, 
    fecha_creacion TIMESTAMP
) SERVER sur_node OPTIONS (schema_name 'public', table_name 'productos');

CREATE FOREIGN TABLE este.productos_ft (
    id INTEGER, 
    nombre VARCHAR(200), 
    descripcion TEXT, 
    precio DECIMAL(10,2), 
    imagen_url VARCHAR(500), 
    categoria_id INTEGER,
    stock INTEGER, 
    region VARCHAR(20), 
    activo BOOLEAN, 
    fecha_creacion TIMESTAMP
) SERVER este_node OPTIONS (schema_name 'public', table_name 'productos');

-- Foreign tables para pedidos
CREATE FOREIGN TABLE norte.pedidos_ft (
    id INTEGER,
    numero_pedido VARCHAR(50),
    cliente_id INTEGER,
    region_cliente VARCHAR(20),
    fecha_pedido TIMESTAMP,
    estado VARCHAR(50),
    subtotal DECIMAL(10,2),
    iva DECIMAL(10,2),
    total DECIMAL(10,2),
    direccion_envio TEXT,
    metodo_pago VARCHAR(100),
    estado_pago VARCHAR(50),
    region_venta VARCHAR(20)
) SERVER norte_node OPTIONS (schema_name 'public', table_name 'pedidos');

CREATE FOREIGN TABLE sur.pedidos_ft (
    id INTEGER,
    numero_pedido VARCHAR(50),
    cliente_id INTEGER,
    region_cliente VARCHAR(20),
    fecha_pedido TIMESTAMP,
    estado VARCHAR(50),
    subtotal DECIMAL(10,2),
    iva DECIMAL(10,2),
    total DECIMAL(10,2),
    direccion_envio TEXT,
    metodo_pago VARCHAR(100),
    estado_pago VARCHAR(50),
    region_venta VARCHAR(20)
) SERVER sur_node OPTIONS (schema_name 'public', table_name 'pedidos');

CREATE FOREIGN TABLE este.pedidos_ft (
    id INTEGER,
    numero_pedido VARCHAR(50),
    cliente_id INTEGER,
    region_cliente VARCHAR(20),
    fecha_pedido TIMESTAMP,
    estado VARCHAR(50),
    subtotal DECIMAL(10,2),
    iva DECIMAL(10,2),
    total DECIMAL(10,2),
    direccion_envio TEXT,
    metodo_pago VARCHAR(100),
    estado_pago VARCHAR(50),
    region_venta VARCHAR(20)
) SERVER este_node OPTIONS (schema_name 'public', table_name 'pedidos');


-- Vista global de productos
CREATE OR REPLACE VIEW global.vista_productos_global AS
SELECT * FROM norte.productos_ft
UNION ALL
SELECT * FROM sur.productos_ft
UNION ALL
SELECT * FROM este.productos_ft;

-- Vista global de pedidos
CREATE OR REPLACE VIEW global.vista_pedidos_global AS
SELECT * FROM norte.pedidos_ft
UNION ALL
SELECT * FROM sur.pedidos_ft
UNION ALL
SELECT * FROM este.pedidos_ft;

-- Vista de estado de nodos
CREATE OR REPLACE VIEW global.estado_nodos AS
SELECT 
    'norte' as nodo,
    (SELECT COUNT(*) FROM norte.productos_ft) as total_productos,
    (SELECT COUNT(*) FROM norte.pedidos_ft WHERE fecha_pedido >= CURRENT_DATE - INTERVAL '7 days') as pedidos_7dias,
    (SELECT COALESCE(SUM(total), 0) FROM norte.pedidos_ft WHERE estado_pago = 'pagado') as ventas_totales

UNION ALL

SELECT 
    'sur' as nodo,
    (SELECT COUNT(*) FROM sur.productos_ft) as total_productos,
    (SELECT COUNT(*) FROM sur.pedidos_ft WHERE fecha_pedido >= CURRENT_DATE - INTERVAL '7 days') as pedidos_7dias,
    (SELECT COALESCE(SUM(total), 0) FROM sur.pedidos_ft WHERE estado_pago = 'pagado') as ventas_totales

UNION ALL

SELECT 
    'este' as nodo,
    (SELECT COUNT(*) FROM este.productos_ft) as total_productos,
    (SELECT COUNT(*) FROM este.pedidos_ft WHERE fecha_pedido >= CURRENT_DATE - INTERVAL '7 days') as pedidos_7dias,
    (SELECT COALESCE(SUM(total), 0) FROM este.pedidos_ft WHERE estado_pago = 'pagado') as ventas_totales;


-- Verificar esquemas
SELECT schema_name FROM information_schema.schemata 
WHERE schema_name IN ('norte', 'sur', 'este', 'global', 'replicas');

-- Verificar foreign tables
SELECT foreign_table_schema, foreign_table_name 
FROM information_schema.foreign_tables;

-- Verificar vistas globales
SELECT table_name FROM information_schema.views 
WHERE table_schema = 'global';

-- Verificar particiones
SELECT schemaname, tablename, partitiontype 
FROM pg_partitions 
WHERE schemaname IN ('norte', 'sur', 'este');

-- FUNCIONES DISTRIBUIDAS
CREATE OR REPLACE FUNCTION global.buscar_productos_distribuido(termino VARCHAR)
RETURNS TABLE(id INTEGER, nombre VARCHAR, precio DECIMAL, region VARCHAR, stock INTEGER)
AS $$
BEGIN
    RETURN QUERY
    SELECT p.id, p.nombre, p.precio, p.region, p.stock
    FROM global.vista_productos_global p
    WHERE p.nombre ILIKE '%' || termino || '%'
    ORDER BY p.region, p.nombre;
END;
$$ LANGUAGE plpgsql;

-- CONSULTAS DE MONITOREO
SELECT * FROM global.estado_nodos;

SELECT region, COUNT(*) as total, SUM(stock) as stock_total
FROM global.vista_productos_global
GROUP BY region;