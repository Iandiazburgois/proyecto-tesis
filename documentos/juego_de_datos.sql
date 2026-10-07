-- Reinicia todas las tablas e IDs a 1 antes de insertar
TRUNCATE TABLE socio, actividad, instalacion, grupo_familia, cuota, novedad, sponsor RESTART IDENTITY CASCADE;

-- 1. INSTALACIONES
INSERT INTO instalacion (nombre, descripcion, imagen_url) VALUES
('Cancha de Futbol 11', 'Cancha de cesped natural con iluminacion LED.', 'https://storage.club.com/instalaciones/futbol11.jpg'),
('Gimnasio Principal', 'Gimnasio equipado para musculacion y basquet.', 'https://storage.club.com/instalaciones/gimnasio.jpg'),
('Pileta Climatizada', 'Pileta semi-olimpica cubierta.', 'https://storage.club.com/instalaciones/pileta.jpg'),
('Cancha de Tenis 1', 'Cancha de polvo de ladrillo.', 'https://storage.club.com/instalaciones/tenis1.jpg');

-- 2. ACTIVIDADES
INSERT INTO actividad (nombre, descripcion, horarios) VALUES
('Futbol Masculino', 'Entrenamiento y torneo interno de futbol 11 para mayores de 18 anos.', 'Lunes y Miercoles 20:00 hs'),
('Futbol Femenino', 'Entrenamiento recreativo y competitivo de futbol 5 y 11.', 'Martes y Jueves 19:30 hs'),
('Natacion Infantil', 'Escuela de natacion para ninos de 5 a 12 anos en pileta climatizada.', 'Sabados 10:00 hs'),
('Natacion Adultos', 'Clases libres y entrenamiento intensivo de natacion para adultos.', 'Lunes a Viernes 08:00 hs'),
('Tenis de Mesa', 'Practica libre y clinica tecnica de tenis de mesa (ping pong).', 'Viernes 18:00 hs'),
('Basquet Infantil', 'Escuelita formativa de basquetbol para jovenes y ninos.', 'Martes y Jueves 17:00 hs'),
('Yoga y Meditacion', 'Clases de Hatha Yoga para relajacion y flexibilidad en salon principal.', 'Miercoles y Viernes 09:00 hs');

-- 3. SOCIOS
INSERT INTO socio (nombre, apellido, dni, email, password, telefono, fecha_nacimiento, categoria, estado, dni_frente_url, dni_dorso_url, fecha_alta) VALUES
('Juan', 'Perez', '35123456', 'juan.perez@email.com', '123456', '1122334455', '1990-05-15', 'Pleno', 'Activo', 'https://storage.club.com/dni/socio_1_frente.jpg', 'https://storage.club.com/dni/socio_1_dorso.jpg', '2024-01-10'),
('Maria', 'Gomez', '38987654', 'maria.gomez@email.com', '123456', '1122334456', '1995-08-22', 'Simple', 'Activo', 'https://storage.club.com/dni/socio_2_frente.jpg', 'https://storage.club.com/dni/socio_2_dorso.jpg', '2024-02-15'),
('Carlos', 'Rodriguez', '28456789', 'carlos.rodriguez@email.com', '123456', '1122334457', '1981-01-10', 'Pleno', 'Inactivo', 'https://storage.club.com/dni/socio_3_frente.jpg', 'https://storage.club.com/dni/socio_3_dorso.jpg', '2023-11-20'),
('Ana', 'Fernandez', '42111222', 'ana.fernandez@email.com', '123456', '1122334458', '1999-11-30', 'Cadete', 'Activo', 'https://storage.club.com/dni/socio_4_frente.jpg', 'https://storage.club.com/dni/socio_4_dorso.jpg', '2024-03-01');

-- 4. GRUPO FAMILIAR
INSERT INTO grupo_familia (id_socio_titular, nombre, apellido, dni, parentesco, dni_frente_url, dni_dorso_url) VALUES
(1, 'Lucas', 'Perez', '52123456', 'Hijo', 'https://storage.club.com/dni/fam_1_frente.jpg', 'https://storage.club.com/dni/fam_1_dorso.jpg'),
(1, 'Laura', 'Sanchez', '36123456', 'Conyuge', 'https://storage.club.com/dni/fam_2_frente.jpg', 'https://storage.club.com/dni/fam_2_dorso.jpg'),
(3, 'Tomas', 'Rodriguez', '54456789', 'Hijo', 'https://storage.club.com/dni/fam_3_frente.jpg', 'https://storage.club.com/dni/fam_3_dorso.jpg');

-- 5. CUOTAS
INSERT INTO cuota (id_socio, mes_periodo, anio_periodo, monto, fecha_vencimiento, estado_pago, medio_pago, fecha_pago, comprobante_url) VALUES
(1, 10, 2026, 15000.00, '2026-10-10', 'Pagado', 'Mercado Pago', '2026-10-05 14:30:00', 'https://storage.club.com/comprobantes/comp_1.pdf'),
(2, 10, 2026, 10000.00, '2026-10-10', 'Pendiente', NULL, NULL, NULL),
(3, 10, 2026, 15000.00, '2026-10-10', 'Pendiente', NULL, NULL, NULL),
(4, 10, 2026, 8000.00, '2026-10-10', 'Pagado', 'Transferencia', '2026-10-02 09:15:00', 'https://storage.club.com/comprobantes/comp_4.pdf');

-- 6. NOVEDADES
INSERT INTO novedad (titulo, contenido, imagen_url, fecha_publicacion, destacado) VALUES
('Torneo Anual de Futbol', 'Este fin de semana comienza el torneo interno en las canchas principales.', 'https://storage.club.com/novedades/torneo.jpg', '2026-10-01 10:00:00', true),
('Obras en la Pileta Climatizada', 'Se realizaran tareas de mantenimiento programado durante el proximo lunes.', 'https://storage.club.com/novedades/obras.jpg', '2026-10-03 16:20:00', false);

-- 7. SPONSORS
INSERT INTO sponsor (nombre, logo_url) VALUES
('Deportes Necochea', 'https://storage.club.com/sponsors/deportes_neco.png'),
('Agua Mineral Pura', 'https://storage.club.com/sponsors/agua_pura.png');