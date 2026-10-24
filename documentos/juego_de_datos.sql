-- =====================================================
-- Juego de datos de prueba - Club Sportivo San Cayetano
-- Ejecutar DESPUÉS de esquema.sql
-- Todos los datos son ficticios.
--
-- Usuarios de prueba (contraseña de todos: 123456)
--   Admin: admin@sportivosc.com  (DNI 20111222)
--   Socio: juan.perez@email.com  (DNI 35123456)
-- =====================================================

-- Reinicia todas las tablas e IDs a 1 antes de insertar
TRUNCATE TABLE socio, profesor, actividad, instalacion, grupo_familia, cuota, novedad, sponsor RESTART IDENTITY CASCADE;

-- 1. INSTALACIONES
INSERT INTO instalacion (nombre, descripcion, imagen_url) VALUES
('Cancha de Fútbol 11', 'Cancha de césped natural con iluminación LED.', 'https://storage.club.com/instalaciones/futbol11.jpg'),
('Gimnasio Principal', 'Gimnasio equipado para musculación y básquet.', 'https://storage.club.com/instalaciones/gimnasio.jpg'),
('Pileta Climatizada', 'Pileta semiolímpica cubierta.', 'https://storage.club.com/instalaciones/pileta.jpg'),
('Cancha de Tenis 1', 'Cancha de polvo de ladrillo.', 'https://storage.club.com/instalaciones/tenis1.jpg'),
('Salón de Usos Múltiples', 'Salón para yoga, reuniones y eventos sociales del club.', 'https://storage.club.com/instalaciones/sum.jpg');

-- 2. PROFESORES
INSERT INTO profesor (nombre, apellido) VALUES
('Martín', 'Acosta'),      -- 1
('Sofía', 'Benítez'),      -- 2
('Diego', 'Castro'),       -- 3
('Valeria', 'Domínguez'),  -- 4
('Pablo', 'Luna');         -- 5

-- 3. ACTIVIDADES (horario en columnas propias)
INSERT INTO actividad (nombre, descripcion, dias, hora_inicio, hora_fin, id_profesor) VALUES
('Fútbol Masculino', 'Entrenamiento y torneo interno de fútbol 11 para mayores de 18 años.', 'Lunes y Miércoles', '20:00', '21:30', 1),
('Fútbol Femenino', 'Entrenamiento recreativo y competitivo de fútbol 5 y 11.', 'Martes y Jueves', '19:30', '21:00', 2),
('Natación Infantil', 'Escuela de natación para niños de 5 a 12 años en pileta climatizada.', 'Sábados', '10:00', '11:00', 3),
('Natación Adultos', 'Clases libres y entrenamiento intensivo de natación para adultos.', 'Lunes a Viernes', '08:00', '09:00', 3),
('Tenis de Mesa', 'Práctica libre y clínica técnica de tenis de mesa (ping pong).', 'Viernes', '18:00', '19:30', 5),
('Básquet Infantil', 'Escuelita formativa de básquetbol para jóvenes y niños.', 'Martes y Jueves', '17:00', '18:00', 1),
('Yoga y Meditación', 'Clases de Hatha Yoga para relajación y flexibilidad en el salón principal.', 'Miércoles y Viernes', '09:00', '10:00', 4),
('Tenis', 'Clases grupales de tenis para todos los niveles en cancha de polvo de ladrillo.', 'Martes y Sábados', '21:00', '22:00', 5);

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
INSERT INTO cuota (id_socio, mes_periodo, anio_periodo, monto, fecha_vencimiento, estado_pago, medio_pago, fecha_pago, comprobante_url) VALUES
(1,  8, 2026, 15000.00, '2026-08-10', 'Pagado', 'Mercado Pago', '2026-08-04 11:00:00', 'https://storage.club.com/comprobantes/comp_1_08.pdf'),
(1,  9, 2026, 15000.00, '2026-09-10', 'Pagado', 'Mercado Pago', '2026-09-06 18:45:00', 'https://storage.club.com/comprobantes/comp_1_09.pdf'),
(1, 10, 2026, 15000.00, '2026-10-10', 'Pagado', 'Mercado Pago', '2026-10-05 14:30:00', 'https://storage.club.com/comprobantes/comp_1_10.pdf'),
(2,  8, 2026, 10000.00, '2026-08-10', 'Pagado', 'Efectivo', '2026-08-09 10:20:00', NULL),
(2,  9, 2026, 10000.00, '2026-09-10', 'Pendiente', NULL, NULL, NULL),
(2, 10, 2026, 10000.00, '2026-10-10', 'Pendiente', NULL, NULL, NULL),
(3,  8, 2026, 15000.00, '2026-08-10', 'Pendiente', NULL, NULL, NULL),
(3,  9, 2026, 15000.00, '2026-09-10', 'Pendiente', NULL, NULL, NULL),
(3, 10, 2026, 15000.00, '2026-10-10', 'Pendiente', NULL, NULL, NULL),
(4,  9, 2026,  8000.00, '2026-09-10', 'Pagado', 'Transferencia', '2026-09-03 09:15:00', 'https://storage.club.com/comprobantes/comp_4_09.pdf'),
(4, 10, 2026,  8000.00, '2026-10-10', 'En revisión', 'Transferencia', '2026-10-09 20:10:00', 'https://storage.club.com/comprobantes/comp_4_10.pdf');

-- 7. NOVEDADES (publicadas por el admin, id_autor = 5)
INSERT INTO novedad (titulo, contenido, imagen_url, fecha_publicacion, destacado, id_autor) VALUES
('Torneo Anual de Fútbol', 'Este fin de semana comienza el torneo interno de fútbol 11 en las canchas principales. Se jugará sábado y domingo desde las 9.', 'https://storage.club.com/novedades/torneo.jpg', '2026-10-01 10:00:00', true, 5),
('Obras en la Pileta Climatizada', 'Se realizarán tareas de mantenimiento programado durante el próximo lunes. Las clases de natación se reprograman para el martes.', 'https://storage.club.com/novedades/obras.jpg', '2026-10-03 16:20:00', false, 5),
('Abren las inscripciones a Natación Infantil', 'Quedan cupos para la escuela de natación de los sábados, para chicos de 5 a 12 años. Inscripción en secretaría.', 'https://storage.club.com/novedades/natacion_inscripcion.jpg', '2026-09-02 09:00:00', false, 5),
('Fútbol Femenino: campeonas del torneo regional', 'El equipo de fútbol femenino ganó la final del torneo regional por 2 a 1. ¡Felicitaciones a las jugadoras y al cuerpo técnico!', 'https://storage.club.com/novedades/femenino_campeonas.jpg', '2026-09-08 21:30:00', true, 5),
('Nuevo horario de Yoga y Meditación', 'A partir de octubre, las clases de yoga pasan a dictarse miércoles y viernes de 9 a 10 en el salón de usos múltiples.', 'https://storage.club.com/novedades/yoga_horario.jpg', '2026-09-12 12:00:00', false, 5),
('Básquet Infantil suma una categoría', 'La escuelita de básquet abre una nueva categoría para chicos de 13 y 14 años. Las prácticas son martes y jueves.', 'https://storage.club.com/novedades/basquet_categoria.jpg', '2026-09-15 18:00:00', false, 5),
('Asamblea anual de socios', 'Se convoca a todos los socios a la asamblea anual ordinaria, el viernes 30 en el salón de usos múltiples a las 20 hs.', NULL, '2026-09-18 10:30:00', true, 5),
('Clínica de tenis de mesa', 'Este viernes habrá una clínica técnica de tenis de mesa abierta a socios y no socios. Traer paleta propia si tienen.', 'https://storage.club.com/novedades/clinica_ping_pong.jpg', '2026-09-20 15:00:00', false, 5),
('Recordatorio: vencimiento de cuotas', 'Les recordamos que la cuota social vence el día 10 de cada mes. Pueden pagar por Mercado Pago, transferencia o en secretaría.', NULL, '2026-09-25 09:00:00', false, 5),
('Cena de aniversario del club', 'Celebramos un nuevo aniversario del Club Sportivo San Cayetano con una cena para socios y familias. Las entradas se venden en secretaría.', 'https://storage.club.com/novedades/cena_aniversario.jpg', '2026-09-28 19:00:00', true, 5),
('Nuevas luces en la cancha de fútbol 11', 'Terminamos el recambio de la iluminación LED de la cancha principal, gracias al aporte de nuestros sponsors.', 'https://storage.club.com/novedades/luces_cancha.jpg', '2026-10-05 17:45:00', false, 5),
('Colonia de verano: preinscripción', 'Ya está abierta la preinscripción a la colonia de verano para hijos de socios. Habrá natación, deportes y juegos recreativos.', 'https://storage.club.com/novedades/colonia.jpg', '2026-10-08 10:00:00', true, 5),
('Natación Adultos: entrenamiento para aguas abiertas', 'Los martes se suma un entrenamiento específico para quienes quieran prepararse para competencias de aguas abiertas.', 'https://storage.club.com/novedades/aguas_abiertas.jpg', '2026-10-10 08:30:00', false, 5),
('Jornada solidaria de donación de útiles', 'Durante todo el mes recibimos útiles escolares en secretaría para las escuelas de la zona. ¡Gracias por colaborar!', NULL, '2026-10-12 11:00:00', false, 5),
('Resultados de la fecha de Fútbol Masculino', 'El primer equipo empató 1 a 1 de visitante y sigue puntero del torneo. La próxima fecha se juega de local.', 'https://storage.club.com/novedades/resultado_masculino.jpg', '2026-10-14 22:00:00', false, 5),
('Torneo de tenis de primavera', 'Se viene el torneo de tenis de primavera en la cancha de polvo de ladrillo. Inscripciones abiertas hasta el viernes.', 'https://storage.club.com/novedades/torneo_tenis.jpg', '2026-10-16 13:00:00', false, 5),
('Mantenimiento del gimnasio', 'El gimnasio principal permanecerá cerrado el sábado por la mañana por tareas de pintura y reparación del piso.', NULL, '2026-10-18 09:15:00', false, 5),
('Bienvenida a los nuevos socios', 'Este mes se sumaron más de 20 familias al club. ¡Bienvenidos a la comunidad del Sportivo!', 'https://storage.club.com/novedades/bienvenida.jpg', '2026-10-20 18:30:00', false, 5);

-- 8. SPONSORS
INSERT INTO sponsor (nombre, logo_url) VALUES
('Deportes Necochea', 'https://storage.club.com/sponsors/deportes_neco.png'),
('Agua Mineral Pura', 'https://storage.club.com/sponsors/agua_pura.png'),
('Panadería El Molino', 'https://storage.club.com/sponsors/el_molino.png');
