# Sitio web del Club Sportivo San Cayetano

Trabajo Final Integrador — Programación IV
Tecnicatura Universitaria en Programación — UTN FRMDP, Extensión Áulica Necochea

## Club Sportivo San Cayetano

Es un club deportivo y social de San Cayetano, enfocado en promover la actividad física y la vida comunitaria a través del fútbol y sus distintas actividades. Funciona como un punto de encuentro clave para las familias del pueblo, impulsando el deporte y el sentido de pertenencia local.

## Integrantes

- Diaz Burgois, Ian
- Arizmendi, Guillermina

## Estado

Etapa 4 — Diseño e implementación de las API.

## Estructura del repositorio

```
README.md                   Este archivo
documentos/                 Entregables de las etapas
  Proyecto Final - Etapa 1.pdf
  wireframes/               Wireframes (pantallas pc y mobile), mapa de navegación y justificación
  informe_etapa_3.pdf       Informe de la base de datos
  Diagrama_ER.png           Diagrama entidad-relación
  esquema.sql               Crea las tablas
  juego_de_datos.sql        Carga los datos de prueba
  especificacion_api.md     Especificación de la API (4.1): rutas, parámetros y códigos de estado
codigo/                     Servidor (Node.js + Express + PostgreSQL), en capas
  server.js                 Carga el .env y pone la aplicación a escuchar
  app.js                    Arma la aplicación: middlewares, rutas y manejo de errores
  config/db.js              Conexión a PostgreSQL
  routes/                   Rutas: qué método y qué dirección llevan a qué controlador
  controllers/              Controladores: leen el pedido, validan el formato y eligen el código de estado
                            (validar.js: las funciones de validación que comparten todos)
  services/                 Servicios: las reglas del club (no usan req ni res)
  data/                     Repositorios: las consultas SQL, un archivo por tabla
  middlewares/              autenticacion.js (401) y soloAdmin.js (403)
  utils/errores.js          ErrorDeNegocio (409) y ErrorDeDatos (400)
  coleccion_pruebas.http    Colección de pruebas de los endpoints (4.6)
  .env.example              Nombres de las variables de entorno, sin sus valores
```

## Tecnologías

Arquitectura en capas: rutas → controladores → servicios → repositorios.
Node.js, Express 5, PostgreSQL, `pg`, `bcryptjs` (contraseñas), `jsonwebtoken` (sesiones con JWT), `dotenv` y `cors`.

---

## Cómo ejecutar el servidor

### 1. Requisitos

| Programa | Versión | Para qué |
|---|---|---|
| [Node.js](https://nodejs.org) | 18 o superior (recomendado: la LTS) | Correr el servidor |
| [PostgreSQL](https://www.postgresql.org/download/) | 18 (el instalador incluye pgAdmin) | La base de datos |
| [Git](https://git-scm.com) | cualquiera | Clonar el repositorio |
| [VS Code](https://code.visualstudio.com) con la extensión **REST Client** | cualquiera | Correr la colección de pruebas |

Para comprobar que están instalados, en una terminal:

```bash
node -v
psql --version
```

> **Windows:** si `psql` no se reconoce, agregá la carpeta `bin` de PostgreSQL al PATH (por ejemplo `C:\Program Files\PostgreSQL\18\bin`) o hacé los pasos 3 y 4 desde **pgAdmin**, que se instala junto con PostgreSQL.

### 2. Clonar el repositorio e instalar las dependencias

```bash
git clone https://github.com/Iandiazburgois/proyecto-tesis.git
cd proyecto-tesis/codigo
npm install
```

### 3. Crear la base de datos

Con el usuario `postgres` (la contraseña es la que elegiste al instalar PostgreSQL):

```bash
psql -U postgres -c "CREATE DATABASE club_sportivo_sc"
```

> **Con pgAdmin:** clic derecho en *Databases* → *Create* → *Database…*, nombre `club_sportivo_sc` → *Save*.

### 4. Crear las tablas y cargar los datos de prueba

Desde la carpeta raíz del repositorio (`proyecto-tesis/`), en este orden: primero el esquema y después los datos.

```bash
psql -U postgres -d club_sportivo_sc -f documentos/esquema.sql
psql -U postgres -d club_sportivo_sc -f documentos/juego_de_datos.sql
```

> **Con pgAdmin:** seleccioná la base `club_sportivo_sc` → *Tools* → *Query Tool* → abrí `documentos/esquema.sql` con el ícono de carpeta → ejecutar (F5). Después, lo mismo con `documentos/juego_de_datos.sql`.

Los dos archivos se pueden volver a correr para dejar la base como al principio.

> El esquema activa la extensión `unaccent`, que usa el buscador para ignorar los acentos. Viene incluida con PostgreSQL; si da un error de permisos, corré los scripts con el usuario `postgres`.

### 5. Configurar las variables de entorno

Dentro de `codigo/`, copiá el archivo de ejemplo con el nombre `.env`:

```bash
# Linux / Mac
cp .env.example .env
# Windows (PowerShell o cmd)
copy .env.example .env
```

Abrí `.env` y completá los valores:

| Variable | Qué poner | Ejemplo |
|---|---|---|
| `PORT` | Puerto del servidor | `3000` |
| `DB_HOST` | Dónde corre PostgreSQL | `127.0.0.1` |
| `DB_PORT` | Puerto de PostgreSQL | `5432` |
| `DB_USER` | Usuario de PostgreSQL | `postgres` |
| `DB_PASSWORD` | La contraseña de ese usuario | la tuya |
| `DB_NAME` | La base creada en el paso 3 | `club_sportivo_sc` |
| `JWT_SECRET` | Un texto largo y difícil de adivinar; firma los tokens de sesión | `una-frase-larga-que-nadie-sepa` |
| `JWT_EXPIRES` | Duración de la sesión (opcional; si no se completa, es 1 hora) | `1h` |

El `.env` tiene contraseñas: por eso está en el `.gitignore` y **nunca se sube al repositorio**. Todas las claves se leen del entorno; ninguna está escrita en el código.

### 6. Arrancar el servidor

Dentro de `codigo/`:

```bash
npm run dev
```

(`npm run dev` reinicia el servidor cada vez que cambia un archivo; `npm start` lo corre una sola vez.)

Tienen que aparecer estas líneas:

```
Servidor corriendo en http://localhost:3000
Conexión a PostgreSQL OK
```

Para comprobarlo, abrí en el navegador <http://localhost:3000/api/buscar?q=futbol>: tiene que mostrar novedades, actividades e instalaciones relacionadas con el fútbol.

### Problemas frecuentes

| Mensaje | Causa | Solución |
|---|---|---|
| `No se pudo conectar a la base: 28P01` | Contraseña de PostgreSQL incorrecta | Revisar `DB_PASSWORD` en el `.env` |
| `No se pudo conectar a la base: 3D000` | La base no existe o el nombre no coincide | Paso 3 y `DB_NAME` |
| `No se pudo conectar a la base: ECONNREFUSED` | PostgreSQL no está corriendo | Iniciar el servicio de PostgreSQL |
| `client password must be a string` | `DB_PASSWORD` vacío en el `.env` | Completar `DB_PASSWORD` con la contraseña de PostgreSQL (paso 5) |
| `relation "socio" does not exist` | Faltó crear las tablas | Paso 4 |
| `Could not read package.json` | La terminal no está en `codigo/` | `cd codigo` |
| `EADDRINUSE` | El puerto ya está en uso | Cerrar el otro servidor o cambiar `PORT` |

---

## Usuarios de prueba

Los carga `juego_de_datos.sql`. Son datos ficticios; la contraseña de todos es `123456`.

| Rol | Email | DNI |
|---|---|---|
| Administrador | `admin@sportivosc.com` | `20111222` |
| Socio con grupo familiar y cuotas pagas | `juan.perez@email.com` | `35123456` |
| Socio con cuotas pendientes | `maria.gomez@email.com` | `38987654` |
| Socio inactivo | `carlos.rodriguez@email.com` | `28456789` |

Se puede iniciar sesión con el email o con el DNI.

## Cómo usar la API

La especificación completa (4.1) está en [`documentos/especificacion_api.md`](documentos/especificacion_api.md). En resumen:

- Dirección base: `http://localhost:3000/api`
- Recursos: `auth`, `socios`, `cuotas`, `grupo-familia`, `novedades`, `actividades`, `profesores`, `instalaciones`, `sponsors` y `buscar`.
- Ver el contenido del sitio (novedades, actividades, profesores, instalaciones, sponsors) y el buscador es **público**.
- Para lo demás, primero se inicia sesión con `POST /api/auth/login` y el cuerpo `{ "usuario": "...", "password": "..." }`. El `token` que devuelve se manda en cada pedido con el encabezado `Authorization: Bearer <token>`.
- Sin token (o con uno vencido), las rutas protegidas responden **401**. Con el token de un socio, las rutas de administrador responden **403**.
- Crear, modificar y borrar contenido, socios y cuotas es solo para el administrador.

## Colección de pruebas

La colección (4.6) está en `codigo/coleccion_pruebas.http` y se ejecuta con la extensión **REST Client** de VS Code.

1. Con la base cargada y el servidor corriendo, abrir `codigo/coleccion_pruebas.http` en VS Code.
2. Hacer clic en **Send Request** sobre cada pedido, en orden de arriba hacia abajo: varios usan el token o el id que devolvió uno anterior.
3. El título de cada pedido indica el código de estado esperado (por ejemplo `→ 401`). La respuesta se abre a la derecha.

Cubre todos los endpoints y los casos de error: contraseña incorrecta, pedido sin token, socio en una ruta de administrador, id inválido o inexistente, datos faltantes o demasiado largos, email, cuota o DNI repetidos y búsqueda sin texto.

Los pedidos crean sus propios datos (un socio con email y DNI al azar, una cuota, una novedad, etc.) y al final los borran, así que la colección se puede correr varias veces y la base queda como estaba.
