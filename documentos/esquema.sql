-- =====================================================
-- Esquema de la base de datos - Club Sportivo San Cayetano
-- Programación IV - Trabajo Final Integrador
-- Ejecutar ANTES de juego_de_datos.sql
--
-- Basado en el esquema original de la etapa 3, con los cambios
-- pedidos en la devolución (ver comentarios "CAMBIOS").
-- =====================================================

-- CAMBIO: extensión para que el buscador (R4) ignore acentos
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Se borran en orden inverso a las dependencias
DROP TABLE IF EXISTS cuota;
DROP TABLE IF EXISTS grupo_familia;
DROP TABLE IF EXISTS novedad;
DROP TABLE IF EXISTS actividad;
DROP TABLE IF EXISTS profesor;
DROP TABLE IF EXISTS instalacion;
DROP TABLE IF EXISTS sponsor;
DROP TABLE IF EXISTS socio;

-- -----------------------------------------------------
-- SOCIO (también es el usuario del sitio)
-- -----------------------------------------------------
CREATE TABLE socio (
    id_socio          SERIAL PRIMARY KEY,
    nombre            VARCHAR(100) NOT NULL,
    apellido          VARCHAR(100) NOT NULL,
    dni               VARCHAR(20)  NOT NULL UNIQUE,
    email             VARCHAR(150) NOT NULL UNIQUE,
    password_hash     VARCHAR(255) NOT NULL,          -- CAMBIO: antes "password" en texto plano
    telefono          VARCHAR(30),
    fecha_nacimiento  DATE NOT NULL,
    categoria         VARCHAR(50)  DEFAULT 'Simple',      -- CAMBIO: antes 'Activo', que es un estado y no una categoría
    estado            VARCHAR(20)  DEFAULT 'Activo',      -- CAMBIO: antes 'Al día', que no coincidía con los datos ('Activo'/'Inactivo')
    dni_frente_url    VARCHAR(255),
    dni_dorso_url     VARCHAR(255),
    fecha_alta        DATE DEFAULT CURRENT_DATE,
    rol               VARCHAR(10)  NOT NULL DEFAULT 'socio'   -- CAMBIO: quién administra el contenido
                      CHECK (rol IN ('socio', 'admin'))
);

-- -----------------------------------------------------
-- GRUPO FAMILIA (N familiares por cada socio titular)
-- -----------------------------------------------------
CREATE TABLE grupo_familia (
    id_grupo          SERIAL PRIMARY KEY,
    id_socio_titular  INTEGER NOT NULL,
    nombre            VARCHAR(100) NOT NULL,
    apellido          VARCHAR(100) NOT NULL,
    dni               VARCHAR(20)  NOT NULL,
    parentesco        VARCHAR(50)  NOT NULL,
    dni_frente_url    VARCHAR(255),
    dni_dorso_url     VARCHAR(255),
    CONSTRAINT fk_grupo_titular FOREIGN KEY (id_socio_titular)
        REFERENCES socio(id_socio) ON DELETE CASCADE
);

-- -----------------------------------------------------
-- CUOTA (N cuotas por socio, una por mes)
-- -----------------------------------------------------
CREATE TABLE cuota (
    id_cuota           SERIAL PRIMARY KEY,
    id_socio           INTEGER NOT NULL,
    mes_periodo        INTEGER CHECK (mes_periodo >= 1 AND mes_periodo <= 12),
    anio_periodo       INTEGER CHECK (anio_periodo >= 2026),
    monto              NUMERIC(10,2) NOT NULL,
    fecha_vencimiento  DATE NOT NULL,
    estado_pago        VARCHAR(20) DEFAULT 'Pendiente',
    medio_pago         VARCHAR(50),
    fecha_pago         TIMESTAMP,
    comprobante_url    VARCHAR(255),
    CONSTRAINT fk_cuota_socio FOREIGN KEY (id_socio)
        REFERENCES socio(id_socio) ON DELETE CASCADE,
    CONSTRAINT cuota_unica_por_mes UNIQUE (id_socio, mes_periodo, anio_periodo)  -- CAMBIO: UNIQUE evita cuotas duplicadas
);

-- -----------------------------------------------------
-- CAMBIO: PROFESOR (los que dictan las actividades del catálogo)
-- -----------------------------------------------------
CREATE TABLE profesor (
    id_profesor  SERIAL PRIMARY KEY,
    nombre       VARCHAR(100) NOT NULL,
    apellido     VARCHAR(100) NOT NULL
);

-- -----------------------------------------------------
-- ACTIVIDAD (disciplinas)
-- CAMBIO: "horarios" (texto) se reemplaza por columnas propias
-- para poder filtrar por hora, y se agrega el profesor
-- -----------------------------------------------------
CREATE TABLE actividad (
    id_actividad  SERIAL PRIMARY KEY,
    nombre        VARCHAR(100) NOT NULL,
    descripcion   TEXT,
    dias          VARCHAR(100),         
    hora_inicio   TIME,
    hora_fin      TIME,
    id_profesor   INTEGER,
    CONSTRAINT fk_actividad_profesor FOREIGN KEY (id_profesor)
        REFERENCES profesor(id_profesor) ON DELETE SET NULL
);

-- -----------------------------------------------------
-- NOVEDAD (noticias del club)
-- -----------------------------------------------------
CREATE TABLE novedad (
    id_novedad         SERIAL PRIMARY KEY,
    titulo             VARCHAR(150) NOT NULL,
    contenido          TEXT NOT NULL,
    imagen_url         VARCHAR(255),
    fecha_publicacion  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    destacado          BOOLEAN DEFAULT FALSE,
    id_autor           INTEGER,          -- CAMBIO: admin que la publicó
    CONSTRAINT fk_novedad_autor FOREIGN KEY (id_autor)
        REFERENCES socio(id_socio) ON DELETE SET NULL
);

-- -----------------------------------------------------
-- INSTALACION
-- -----------------------------------------------------
CREATE TABLE instalacion (
    id_instalacion  SERIAL PRIMARY KEY,
    nombre          VARCHAR(100) NOT NULL,
    descripcion     TEXT,
    imagen_url      VARCHAR(255)
);

-- -----------------------------------------------------
-- SPONSOR
-- -----------------------------------------------------
CREATE TABLE sponsor (
    id_sponsor  SERIAL PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL,
    logo_url    VARCHAR(255)
);
