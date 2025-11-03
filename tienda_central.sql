
-- Limpiar configuración existente
DROP USER MAPPING IF EXISTS FOR CURRENT_USER SERVER norte_node;
DROP USER MAPPING IF EXISTS FOR CURRENT_USER SERVER sur_node;
DROP USER MAPPING IF EXISTS FOR CURRENT_USER SERVER este_node;

DROP SERVER IF EXISTS norte_node CASCADE;
DROP SERVER IF EXISTS sur_node CASCADE;
DROP SERVER IF EXISTS este_node CASCADE;

-- Crear extensiones para distribución
CREATE EXTENSION IF NOT EXISTS postgres_fdw;

-- Crear servidores para conectar a nodos regionales
CREATE SERVER norte_node FOREIGN DATA WRAPPER postgres_fdw
OPTIONS (host 'localhost', dbname 'tienda_norte', port '5432');

CREATE SERVER sur_node FOREIGN DATA WRAPPER postgres_fdw
OPTIONS (host 'localhost', dbname 'tienda_sur', port '5432');

CREATE SERVER este_node FOREIGN DATA WRAPPER postgres_fdw
OPTIONS (host 'localhost', dbname 'tienda_este', port '5432');

-- Mapear usuarios para conexión
CREATE USER MAPPING FOR CURRENT_USER SERVER norte_node 
OPTIONS (user 'tienda_user', password 'Tienda2024!');

CREATE USER MAPPING FOR CURRENT_USER SERVER sur_node 
OPTIONS (user 'tienda_user', password 'Tienda2024!');

CREATE USER MAPPING FOR CURRENT_USER SERVER este_node 
OPTIONS (user 'tienda_user', password 'Tienda2024!');

SELECT 'Configuración completa del nodo central terminada' as estado;


CREATE SCHEMA IF NOT EXISTS norte;
CREATE SCHEMA IF NOT EXISTS sur;
CREATE SCHEMA IF NOT EXISTS este;
CREATE SCHEMA IF NOT EXISTS global;
CREATE SCHEMA IF NOT EXISTS replicas;

COMMENT ON SCHEMA norte IS 'Particiones para datos del nodo norte';
COMMENT ON SCHEMA sur IS 'Particiones para datos del nodo sur';
COMMENT ON SCHEMA este IS 'Particiones para datos del nodo este';
COMMENT ON SCHEMA global IS 'Vistas y tablas globales del sistema distribuido';
COMMENT ON SCHEMA replicas IS 'Tablas replicadas en todos los nodos';

SELECT 'Esquemas distribuidos creados' as estado;

CREATE SEQUENCE global.productos_id_seq START 1001;
CREATE SEQUENCE global.clientes_id_seq START 2001;

SELECT 'Secuencias globales creadas' as estado;

-- TABLAS MAESTRAS PARTICIONADAS

-- Tabla productos distribuida por región
CREATE TABLE global.productos (
    id INTEGER DEFAULT nextval('global.productos_id_seq'),
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

-- Crear particiones para cada región
CREATE TABLE norte.productos PARTITION OF global.productos FOR VALUES IN ('norte');
CREATE TABLE sur.productos PARTITION OF global.productos FOR VALUES IN ('sur');
CREATE TABLE este.productos PARTITION OF global.productos FOR VALUES IN ('este');

-- Tabla clientes distribuida por región
CREATE TABLE global.clientes (
    id INTEGER DEFAULT nextval('global.clientes_id_seq'),
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

SELECT 'Tablas particionadas creadas' as estado;

-- TABLA DE ADMINISTRADORES GLOBAL

CREATE TABLE global.administradores (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nombre_completo VARCHAR(200) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    nivel_acceso VARCHAR(20) DEFAULT 'admin',
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_acceso TIMESTAMP
);

-- Insertar administrador por defecto (password: Admin1234)
INSERT INTO global.administradores (username, password_hash, nombre_completo, email) 
VALUES ('admin', 'admin123', 'Administrador Principal', 'admin@tienda.com');

SELECT 'Tabla de administradores creada' as estado;

-- FOREIGN TABLES PARA ACCEDER A DATOS DISTRIBUIDOS

-- Foreign tables para productos de cada región
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

-- Foreign tables para categorías de cada región
CREATE FOREIGN TABLE norte.categorias_ft (
    id INTEGER, 
    nombre VARCHAR(100), 
    descripcion TEXT, 
    activo BOOLEAN
) SERVER norte_node OPTIONS (schema_name 'public', table_name 'categorias');

CREATE FOREIGN TABLE sur.categorias_ft (
    id INTEGER, 
    nombre VARCHAR(100), 
    descripcion TEXT, 
    activo BOOLEAN
) SERVER sur_node OPTIONS (schema_name 'public', table_name 'categorias');

CREATE FOREIGN TABLE este.categorias_ft (
    id INTEGER, 
    nombre VARCHAR(100), 
    descripcion TEXT, 
    activo BOOLEAN
) SERVER este_node OPTIONS (schema_name 'public', table_name 'categorias');

SELECT 'Foreign tables creadas' as estado;

-- VISTAS GLOBALES PARA CONSULTAS DISTRIBUIDAS
-- Vista que une todos los productos de todas las regiones
CREATE OR REPLACE VIEW global.vista_productos_global AS
SELECT * FROM norte.productos_ft
UNION ALL
SELECT * FROM sur.productos_ft
UNION ALL
SELECT * FROM este.productos_ft;

-- Vista para monitoreo del sistema
CREATE OR REPLACE VIEW global.estado_nodos AS
SELECT 
    'norte' as nodo,
    (SELECT COUNT(*) FROM norte.productos_ft) as total_productos,
    (SELECT COUNT(*) FROM norte.productos_ft WHERE stock = 0) as productos_sin_stock

UNION ALL

SELECT 
    'sur' as nodo,
    (SELECT COUNT(*) FROM sur.productos_ft) as total_productos,
    (SELECT COUNT(*) FROM sur.productos_ft WHERE stock = 0) as productos_sin_stock

UNION ALL

SELECT 
    'este' as nodo,
    (SELECT COUNT(*) FROM este.productos_ft) as total_productos,
    (SELECT COUNT(*) FROM este.productos_ft WHERE stock = 0) as productos_sin_stock;

-- Vista de inventario consolidado
CREATE OR REPLACE VIEW global.inventario_global AS
SELECT 
    region,
    COUNT(*) as total_productos,
    SUM(stock) as stock_total,
    AVG(precio) as precio_promedio
FROM global.vista_productos_global
WHERE activo = true
GROUP BY region;


-- Vista completa de inventario con categorías
CREATE OR REPLACE VIEW global.inventario_completo AS
SELECT 
    p.id,
    p.nombre,
    p.descripcion,
    p.precio,
    p.stock,
    p.stock_minimo,
    p.region as sucursal,
    c.nombre as categoria,
    p.imagen_url,
    p.activo,
    CASE 
        WHEN p.stock = 0 THEN 'AGOTADO'
        WHEN p.stock < p.stock_minimo THEN 'BAJO STOCK' 
        ELSE 'DISPONIBLE'
    END as estado_stock,
    p.fecha_creacion
FROM global.vista_productos_global p
LEFT JOIN LATERAL (
    SELECT nombre FROM norte.categorias_ft WHERE id = p.categoria_id AND p.region = 'norte'
    UNION ALL
    SELECT nombre FROM sur.categorias_ft WHERE id = p.categoria_id AND p.region = 'sur'
    UNION ALL  
    SELECT nombre FROM este.categorias_ft WHERE id = p.categoria_id AND p.region = 'este'
) c ON true;

-- Vista para búsquedas avanzadas por producto
CREATE OR REPLACE VIEW global.busqueda_productos AS
SELECT 
    nombre,
    descripcion,
    precio,
    stock,
    sucursal,
    categoria,
    estado_stock,
    COUNT(*) OVER (PARTITION BY nombre) as total_sucursales,
    SUM(stock) OVER (PARTITION BY nombre) as stock_total
FROM global.inventario_completo
WHERE activo = true;

-- Vista para estadísticas del administrador
CREATE OR REPLACE VIEW global.estadisticas_sucursales AS
SELECT 
    sucursal,
    COUNT(*) as total_productos,
    SUM(stock) as total_stock,
    AVG(precio) as precio_promedio,
    SUM(CASE WHEN stock = 0 THEN 1 ELSE 0 END) as productos_agotados,
    SUM(CASE WHEN stock > 0 AND stock < stock_minimo THEN 1 ELSE 0 END) as productos_bajo_stock,
    COUNT(DISTINCT categoria) as categorias_unicas
FROM global.inventario_completo
GROUP BY sucursal;

SELECT '✅ Vistas globales creadas' as estado;

-- VERIFICACIÓN FINAL DEL SISTEMA

SELECT '🎉 NODO CENTRAL CONFIGURADO EXITOSAMENTE' as resultado_final;

-- Verificar conexión con nodos
SELECT 
    'norte' as nodo,
    (SELECT COUNT(*) FROM norte.productos_ft) as productos,
    (SELECT COUNT(*) FROM norte.categorias_ft) as categorias
UNION ALL
SELECT 
    'sur' as nodo,
    (SELECT COUNT(*) FROM sur.productos_ft) as productos,
    (SELECT COUNT(*) FROM sur.categorias_ft) as categorias
UNION ALL
SELECT 
    'este' as nodo,
    (SELECT COUNT(*) FROM este.productos_ft) as productos,
    (SELECT COUNT(*) FROM este.categorias_ft) as categorias;

-- Mostrar estado de administradores
SELECT username, nombre_completo, email FROM global.administradores WHERE activo = true;