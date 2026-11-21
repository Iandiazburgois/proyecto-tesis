-- =====================================================
-- Juego de datos de prueba - Club Sportivo San Cayetano
-- Ejecutar DESPUÉS de esquema.sql
-- Socios, familiares y cuotas son ficticios.
-- Disciplinas, novedades, instalaciones y sponsors son del club.
--
-- Usuarios de prueba (contraseña de todos: 123456)
--   Admin: admin@sportivosc.com  (DNI 20111222)
--   Socio: juan.perez@email.com  (DNI 35123456)
-- =====================================================

-- Reinicia todas las tablas e IDs a 1 antes de insertar
TRUNCATE TABLE socio, profesor, actividad, instalacion, grupo_familia, cuota, novedad, sponsor RESTART IDENTITY CASCADE;

-- 1. INSTALACIONES (las fotos están en codigo/frontend/public/imagenes/instalaciones)
INSERT INTO instalacion (nombre, descripcion, imagen_url) VALUES
('Cancha de Sportivo San Cayetano', 'Estadio Nuevo Felipe Serafini.', '/imagenes/instalaciones/cancha-sportivo.jpg'),
('Cancha sintética', 'Cancha de césped sintético para entrenamientos y partidos de fútbol.', '/imagenes/instalaciones/cancha-sintetica.jpg'),
('Salón del club', 'En la sede social, 25 de Mayo 148. Para eventos, reuniones y festejos.', '/imagenes/instalaciones/salon.jpg'),
('Fogón del club', 'Espacio con parrillas y fogón para compartir después de los partidos.', '/imagenes/instalaciones/fogon.jpg');

-- 2. PROFESORES
INSERT INTO profesor (nombre, apellido) VALUES
('Martín', 'Acosta'),      -- 1
('Sofía', 'Benítez');      -- 2

-- 3. ACTIVIDADES (disciplinas del club; sin días ni horarios cargados)
INSERT INTO actividad (nombre, descripcion, dias, hora_inicio, hora_fin, id_profesor) VALUES
('Fútbol', 'Infantiles, juveniles, femenino, senior y primera.', NULL, NULL, NULL, 1),
('Hockey femenino', 'Hockey para chicas y mujeres, desde las categorías infantiles hasta primera.', NULL, NULL, NULL, 2);

-- 4. SOCIOS (password_hash = bcrypt de '123456')
INSERT INTO socio (nombre, apellido, dni, email, password_hash, telefono, fecha_nacimiento, categoria, estado, dni_frente_url, dni_dorso_url, fecha_alta, rol) VALUES
('Juan', 'Pérez', '35123456', 'juan.perez@email.com', '$2b$10$Chhs1bKk95KLtwQptou3yuZ3IgHoMYLhdnPvfvZnkJWzmVu.l0hdm', '1122334455', '1990-05-15', 'Pleno', 'Activo', 'https://storage.club.com/dni/socio_1_frente.jpg', 'https://storage.club.com/dni/socio_1_dorso.jpg', '2024-01-10', 'socio'),
('María', 'Gómez', '38987654', 'maria.gomez@email.com', '$2b$10$Chhs1bKk95KLtwQptou3yuZ3IgHoMYLhdnPvfvZnkJWzmVu.l0hdm', '1122334456', '1995-08-22', 'Simple', 'Activo', 'https://storage.club.com/dni/socio_2_frente.jpg', 'https://storage.club.com/dni/socio_2_dorso.jpg', '2024-02-15', 'socio'),
('Carlos', 'Rodríguez', '28456789', 'carlos.rodriguez@email.com', '$2b$10$Chhs1bKk95KLtwQptou3yuZ3IgHoMYLhdnPvfvZnkJWzmVu.l0hdm', '1122334457', '1981-01-10', 'Pleno', 'Inactivo', 'https://storage.club.com/dni/socio_3_frente.jpg', 'https://storage.club.com/dni/socio_3_dorso.jpg', '2023-11-20', 'socio'),
('Ana', 'Fernández', '42111222', 'ana.fernandez@email.com', '$2b$10$Chhs1bKk95KLtwQptou3yuZ3IgHoMYLhdnPvfvZnkJWzmVu.l0hdm', '1122334458', '1999-11-30', 'Cadete', 'Activo', 'https://storage.club.com/dni/socio_4_frente.jpg', 'https://storage.club.com/dni/socio_4_dorso.jpg', '2024-03-01', 'socio'),
('Admin', 'Club', '20111222', 'admin@sportivosc.com', '$2b$10$Chhs1bKk95KLtwQptou3yuZ3IgHoMYLhdnPvfvZnkJWzmVu.l0hdm', '1122334400', '1985-03-20', 'Pleno', 'Activo', NULL, NULL, '2023-01-01', 'admin');

-- 5. GRUPO FAMILIAR
INSERT INTO grupo_familia (id_socio_titular, nombre, apellido, dni, parentesco, dni_frente_url, dni_dorso_url) VALUES
(1, 'Lucas', 'Pérez', '52123456', 'Hijo', 'https://storage.club.com/dni/fam_1_frente.jpg', 'https://storage.club.com/dni/fam_1_dorso.jpg'),
(1, 'Laura', 'Sánchez', '36123456', 'Cónyuge', 'https://storage.club.com/dni/fam_2_frente.jpg', 'https://storage.club.com/dni/fam_2_dorso.jpg'),
(3, 'Tomás', 'Rodríguez', '54456789', 'Hijo', 'https://storage.club.com/dni/fam_3_frente.jpg', 'https://storage.club.com/dni/fam_3_dorso.jpg');

-- 6. CUOTAS (agosto a octubre, para que haya deuda acumulada que mostrar)
-- Cuota social: $3.000 por persona (titular + familiares), en una sola cuota por grupo
--   Juan: 3 personas = 9.000 / María: 1 = 3.000 / Carlos: 2 = 6.000 / Ana: 1 = 3.000
INSERT INTO cuota (id_socio, mes_periodo, anio_periodo, monto, fecha_vencimiento, estado_pago, medio_pago, fecha_pago, comprobante_url) VALUES
(1,  8, 2026,  9000.00, '2026-08-10', 'Pagado', 'Mercado Pago', '2026-08-04 11:00:00', 'https://storage.club.com/comprobantes/comp_1_08.pdf'),
(1,  9, 2026,  9000.00, '2026-09-10', 'Pagado', 'Mercado Pago', '2026-09-06 18:45:00', 'https://storage.club.com/comprobantes/comp_1_09.pdf'),
(1, 10, 2026,  9000.00, '2026-10-10', 'Pagado', 'Mercado Pago', '2026-10-05 14:30:00', 'https://storage.club.com/comprobantes/comp_1_10.pdf'),
(2,  8, 2026,  3000.00, '2026-08-10', 'Pagado', 'Efectivo', '2026-08-09 10:20:00', NULL),
(2,  9, 2026,  3000.00, '2026-09-10', 'Pendiente', NULL, NULL, NULL),
(2, 10, 2026,  3000.00, '2026-10-10', 'Pendiente', NULL, NULL, NULL),
(3,  8, 2026,  6000.00, '2026-08-10', 'Pendiente', NULL, NULL, NULL),
(3,  9, 2026,  6000.00, '2026-09-10', 'Pendiente', NULL, NULL, NULL),
(3, 10, 2026,  6000.00, '2026-10-10', 'Pendiente', NULL, NULL, NULL),
(4,  9, 2026,  3000.00, '2026-09-10', 'Pagado', 'Transferencia', '2026-09-03 09:15:00', 'https://storage.club.com/comprobantes/comp_4_09.pdf'),
(4, 10, 2026,  3000.00, '2026-10-10', 'En revisión', 'Transferencia', '2026-10-09 20:10:00', 'https://storage.club.com/comprobantes/comp_4_10.pdf');

-- 7. NOVEDADES (publicadas por el admin, id_autor = 5; las fotos están en public/imagenes/novedades)
INSERT INTO novedad (titulo, contenido, imagen_url, fecha_publicacion, destacado, id_autor) VALUES
('Copa Pedro Rocha', 'Próximo partido: domingo a las 20 h. La categoría Sub 16 del club se enfrenta a San Martín de Chaves por el Torneo Interligas del Sudeste en el Felipe Serafini. ¡Los esperamos para alentar a los chicos!', '/imagenes/novedades/copa-pedro-rocha.jpg', '2026-11-19 10:00:00', true, 5),
('Encuentro de escuelitas', 'El pasado domingo los más chicos viajaron a De la Garma para disputar un encuentro de escuelitas de fútbol en el Club Atlético Agrario, a quienes agradecemos por la invitación y la organización del torneo.', '/imagenes/novedades/encuentro-escuelitas.jpg', '2026-11-16 18:00:00', false, 5),
('Torneo de Primera División', 'Se terminó el torneo para Sportivo. Luego de un comienzo incierto, el equipo terminó en la 5.ª posición, con una gran demostración de carácter. ¡Vamos los pibes!', '/imagenes/novedades/torneo-primera.jpg', '2026-11-09 20:00:00', false, 5);

-- 8. SPONSORS (los logos están todos juntos en public/imagenes/sponsors.jpg)
INSERT INTO sponsor (nombre, logo_url) VALUES
('Electricidad Belgrano', NULL),
('Metalúrgica FK', NULL),
('Roteño', NULL),
('Los Sobrinos Mercado', NULL),
('Chofi S.A.', NULL),
('Construcciones Román', NULL),
('Presa Mármoles', NULL),
('JP Ingeniería & Proyectos', NULL),
('Establecimiento Don Pancho', NULL),
('David Zubia Instalaciones Eléctricas', NULL),
('Tío Peba', NULL);