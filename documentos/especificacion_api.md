# 4.1 Especificación de las API — Club Sportivo San Cayetano

Acá están todas las rutas que tiene nuestra API: qué hace cada una, qué datos hay que mandarle, qué devuelve y qué códigos de estado puede responder. La escribimos antes de programar, para que los dos trabajemos sobre lo mismo.

- **Dirección base:** `http://localhost:3000/api`
- **Formato:** todo se manda y se recibe en JSON.
- **Sesión:** cuando alguien inicia sesión, la API le devuelve un token. Para usar las rutas protegidas hay que mandar ese token en el encabezado `Authorization: Bearer <token>`.

## Quién puede usar cada ruta

- **Pública:** cualquiera, sin iniciar sesión.
- **Socio:** cualquier persona que haya iniciado sesión.
- **Admin:** solo quien inició sesión con un usuario administrador del club (`rol = 'admin'`).

## Cómo está organizada

Separamos la API en capas, como vimos en clase. La **ruta** recibe el pedido y se lo pasa al **controlador**, que revisa que los datos vengan bien y decide qué código responder. El controlador le pide las cosas al **servicio**, que es donde están las reglas del club. Y el servicio se las pide al **repositorio**, que es el único que habla con la base de datos.

## Reglas que valen para todas las rutas

- Si una ruta pide sesión y no mandás el token, o el token venció, responde **401**.
- Si iniciaste sesión pero no tenés permiso (por ejemplo, un socio que quiere borrar una novedad), responde **403**.
- Si en la dirección va un id (`/novedades/5`) y no es un número, responde **400**. Si es un número pero no existe, responde **404**.
- Cuando algo sale mal, la respuesta siempre tiene la forma `{ "error": "mensaje" }`. Si faltan datos, también dice cuáles: `{ "campos": [...] }`.
- En los `PUT` se puede mandar solo lo que se quiere cambiar. Lo que no se manda queda como estaba.
- Los montos de las cuotas se devuelven como número (`15000` y no `"15000.00"`).
- **409** quiere decir que el pedido está bien armado, pero choca con algo que ya está en la base. Por ejemplo, registrarse con un email que ya usa otro socio, o mandar el comprobante de una cuota que ya está pagada.
- **500** quiere decir que falló el servidor. El detalle del error se ve en la terminal, nunca en la respuesta, para no mostrarle información interna a nadie de afuera.

Algunas decisiones que tomamos:

- **Si al cambiar la contraseña la actual está mal, respondemos 400 y no 401.** La sesión es válida; lo que está mal es un dato del formulario. Si respondiéramos 401, el sitio pensaría que la sesión se venció y sacaría al usuario.
- **Si un socio pide una cuota o un familiar de otro socio, respondemos 404 y no 403.** Con un 403 le estaríamos confirmando que ese dato existe.

## Registro e inicio de sesión (4.3)

Los campos con `*` son obligatorios.

| Método | Ruta | Parámetros | Qué hay que mandar | Qué devuelve | Códigos | Acceso |
|---|---|---|---|---|---|---|
| POST | `/auth/registro` | — | `{ socio: { nombre*, apellido*, dni*, email*, password* (mínimo 6 caracteres), fecha_nacimiento* (AAAA-MM-DD), telefono, dni_frente_url, dni_dorso_url }, familiares: [{ nombre*, apellido*, dni*, parentesco*, dni_frente_url, dni_dorso_url }] }` | El socio creado con su grupo familiar, sin la contraseña. El titular y los familiares se guardan juntos: si algo falla, no se guarda nada. Todo el que se registra queda como socio, nunca como admin | 201, 400 (faltan datos o están mal escritos), 409 (ya hay un socio con ese email o DNI) | Pública |
| POST | `/auth/login` | — | `{ usuario*, password* }`. El usuario puede ser el email o el DNI | `{ token, socio }`. El token dura 1 hora | 200, 400 (faltan datos), 401 (el usuario o la contraseña no coinciden) | Pública |

## Socios (4.2)

| Método | Ruta | Parámetros | Qué hay que mandar | Qué devuelve | Códigos | Acceso |
|---|---|---|---|---|---|---|
| GET | `/socios/me` | — | — | Mis datos y mi grupo familiar | 200, 401 | Socio |
| PUT | `/socios/me` | — | Lo que quiera cambiar de `{ nombre, apellido, telefono, email }` | Mis datos actualizados | 200, 400, 401, 409 (ese email ya lo usa otro socio) | Socio |
| PUT | `/socios/me/password` | — | `{ actual*, nueva* (mínimo 6 caracteres) }` | Nada | 204, 400 (la actual no coincide o la nueva es muy corta), 401 | Socio |
| POST | `/socios/me/baja` | — | — | Mis datos con el estado en "Baja solicitada". El socio no se borra, así el club conserva su historial | 200, 401, 409 (ya la había pedido) | Socio |
| GET | `/socios` | Opcionales: `estado`, `q` (para buscar por nombre, DNI o email) | — | La lista de socios | 200, 401, 403 | Admin |
| GET | `/socios/:id` | `id` | — | El socio, con su grupo familiar y sus cuotas | 200, 400, 401, 403, 404 | Admin |
| PUT | `/socios/:id` | `id` | Lo que quiera cambiar de `{ estado (Activo / Inactivo / Baja solicitada), categoria, rol (socio / admin) }` | El socio actualizado | 200, 400, 401, 403, 404 | Admin |
| DELETE | `/socios/:id` | `id` | — | Nada. Se borran también sus cuotas y su grupo familiar | 204, 400, 401, 403, 404 | Admin |

## Cuotas (4.2)

| Método | Ruta | Parámetros | Qué hay que mandar | Qué devuelve | Códigos | Acceso |
|---|---|---|---|---|---|---|
| GET | `/cuotas/mias` | — | — | Mis cuotas, cuántas debo y el total a pagar. Las que están "En revisión" cuentan como no pagadas | 200, 401 | Socio |
| PUT | `/cuotas/:id/comprobante` | `id` | `{ comprobante_url*, medio_pago* }` | La cuota, que pasa a "En revisión" hasta que el club confirme el pago | 200, 400, 401, 404 (no existe o es de otro socio), 409 (ya está pagada) | Socio |
| GET | `/cuotas` | Opcionales: `id_socio`, `estado`, `mes`, `anio` | — | La lista de cuotas, con el nombre, apellido y DNI de cada socio | 200, 400, 401, 403 | Admin |
| GET | `/cuotas/:id` | `id` | — | La cuota | 200, 400, 401, 403, 404 | Admin |
| POST | `/cuotas` | — | `{ id_socio*, mes_periodo* (1 a 12), anio_periodo* (2026 en adelante), monto* (mayor a 0), fecha_vencimiento* }` | La cuota creada, en "Pendiente" | 201, 400 (datos mal o el socio no existe), 401, 403, 409 (ese socio ya tiene cuota de ese mes) | Admin |
| PUT | `/cuotas/:id` | `id` | Lo que quiera cambiar de `{ estado_pago (Pendiente / En revisión / Pagado), monto, fecha_vencimiento }` | La cuota actualizada. Si pasa a "Pagado" y no tenía fecha de pago, se pone la de hoy | 200, 400, 401, 403, 404 | Admin |
| DELETE | `/cuotas/:id` | `id` | — | Nada | 204, 400, 401, 403, 404 | Admin |

## Contenido del sitio (4.2)

Novedades, actividades, profesores, instalaciones y sponsors funcionan todos igual: cualquiera los puede ver, pero solo el admin puede crearlos, modificarlos o borrarlos.

| Qué es (ruta) | Qué hay que mandar al crear o modificar (`*` obligatorio al crear) | Detalles |
|---|---|---|
| Novedades (`/novedades`) | `{ titulo*, contenido*, imagen_url, destacado (true o false) }` | Se listan de la más nueva a la más vieja. El autor es el admin que la publica: sale de su sesión, no hay que mandarlo |
| Actividades (`/actividades`) | `{ nombre*, descripcion, dias, hora_inicio (HH:MM), hora_fin (HH:MM), id_profesor }` | Cada actividad viene con el nombre y el apellido de su profesor. Si el profesor indicado no existe, responde 400 |
| Profesores (`/profesores`) | `{ nombre*, apellido* }` | Si se borra un profesor, sus actividades quedan sin profesor, pero no se borran |
| Instalaciones (`/instalaciones`) | `{ nombre*, descripcion, imagen_url }` | — |
| Sponsors (`/sponsors`) | `{ nombre*, logo_url }` | — |

Las rutas son las mismas para los cinco (en lugar de `<entidad>` va `novedades`, `actividades`, etc.):

| Método | Ruta | Qué devuelve | Códigos | Acceso |
|---|---|---|---|---|
| GET | `/<entidad>` | La lista | 200 | Pública |
| GET | `/<entidad>/:id` | Uno solo | 200, 400, 404 | Pública |
| POST | `/<entidad>` | El que se creó | 201, 400, 401, 403 | Admin |
| PUT | `/<entidad>/:id` | Cómo quedó | 200, 400 (no se mandó nada o se dejó vacío un dato obligatorio), 401, 403, 404 | Admin |
| DELETE | `/<entidad>/:id` | Nada | 204, 400, 401, 403, 404 | Admin |

## Grupo familiar (4.2)

Cada socio solo ve y maneja a su propia familia. Quién es el socio sale de su sesión, nunca de lo que manda, así nadie puede tocar la familia de otro.

| Método | Ruta | Parámetros | Qué hay que mandar | Qué devuelve | Códigos | Acceso |
|---|---|---|---|---|---|---|
| GET | `/grupo-familia` | — | — | Mis familiares | 200, 401 | Socio |
| GET | `/grupo-familia/:id` | `id` | — | Un familiar | 200, 400, 401, 404 (también si es de otro socio) | Socio |
| POST | `/grupo-familia` | — | `{ nombre*, apellido*, dni*, parentesco*, dni_frente_url, dni_dorso_url }` | El familiar agregado | 201, 400, 401, 409 (ese DNI ya está en mi grupo) | Socio |
| PUT | `/grupo-familia/:id` | `id` | Lo que quiera cambiar de esos mismos datos | Cómo quedó | 200, 400, 401, 404, 409 | Socio |
| DELETE | `/grupo-familia/:id` | `id` | — | Nada | 204, 400, 401, 404 | Socio |

## Buscador (4.4)

| Método | Ruta | Parámetros | Qué hay que mandar | Qué devuelve | Códigos | Acceso |
|---|---|---|---|---|---|---|
| GET | `/buscar` | `q`* = el texto a buscar (hasta 100 caracteres) | — | Lo que encontró, separado en novedades, actividades e instalaciones, y cuántos resultados hay en total. No importan las mayúsculas ni las tildes: "futbol" encuentra "Fútbol". Si no encuentra nada, devuelve las listas vacías y total 0 (no es un error) | 200, 400 (no se mandó qué buscar) | Pública |