# Sitio web del Club Sportivo San Cayetano

Trabajo Final Integrador — Programación IV
UTN FRMDP, Extensión Áulica Necochea — Prof. Cesar Augusto Fernandez Carbonell

## Qué es

Sitio web del Club Sportivo San Cayetano, un club deportivo y social de San Cayetano fundado en 1928, con fútbol y hockey femenino. Hoy el club no tiene sitio propio: su información está repartida en varias redes sociales. El sitio la junta en un solo lugar y permite hacer trámites sin ir a la sede.

- **Cualquier visitante** puede ver el inicio (historia, disciplinas, novedades, instalaciones y sponsors), buscar contenido y asociarse.
- **Los socios**, con su sesión iniciada, ven y modifican sus datos, ven el estado de sus cuotas, envían comprobantes de pago y agregan familiares.
- **El administrador** emite las cuotas, aprueba o rechaza comprobantes, gestiona los socios y publica novedades.

## Integrantes

- Díaz Burgois, Ian
- Arizmendi, Guillermina

## Tecnologías

- **Frontend:** React, Vite y React Router.
- **Backend:** Node.js, Express y PostgreSQL, con `pg`, `bcryptjs`, `jsonwebtoken`, `dotenv` y `cors`.

## Estructura

```
documentos/          Entregables de las etapas y scripts de la base de datos
codigo/backend/      Servidor y API
codigo/frontend/     Sitio en React
```

---

## Cómo ejecutarlo

Los pasos están pensados para **Windows**. En Mac o Linux son iguales, salvo donde se aclara.

### Paso 1. Instalar los programas

Descargá e instalá estos tres programas, con las opciones que vienen marcadas:

1. **Node.js** (versión 20.19 o superior): <https://nodejs.org>. Elegí la versión que dice **LTS**.
2. **PostgreSQL**: <https://www.postgresql.org/download/>. Durante la instalación te pide una **contraseña para el usuario `postgres`**: elegí una y **anotala**, la vas a necesitar en los pasos 3 y 4. El instalador también instala **pgAdmin**, el programa para manejar la base de datos.
3. **Git** (opcional): <https://git-scm.com>. Solo hace falta para descargar el proyecto con la opción A del paso 2.

Cuando termines, **reiniciá la computadora** para que Windows reconozca los programas nuevos.

### Paso 2. Abrir una terminal y descargar el proyecto

La terminal es una ventana donde se escriben comandos. Para abrirla:

1. Apretá la tecla **Windows**, escribí **PowerShell** y abrí **Windows PowerShell**.
   (En Mac: abrí **Terminal** desde Aplicaciones → Utilidades.)
2. Se abre una ventana con un texto parecido a `PS C:\Users\TuNombre>`. Ahí se escriben los comandos: copiá cada línea, pegala con **clic derecho** y apretá **Enter**.

Primero, comprobá que los programas quedaron instalados:

```bash
node -v
git --version
```

Tiene que aparecer un número de versión en cada uno, por ejemplo `v22.12.0` y `git version 2.55.0`. Si `node` no se reconoce, reiniciá la computadora y volvé a abrir PowerShell. Si `git` no se reconoce, usá la opción B de abajo.

Ahora descargá el proyecto en el Escritorio. Elegí una de las dos opciones:

**Opción A — con Git:** escribí estos comandos de a uno, apretando **Enter** después de cada uno:

```bash
cd Desktop
git clone https://github.com/Iandiazburgois/proyecto-tesis.git
```

**Opción B — sin Git:**

1. Entrá a <https://github.com/Iandiazburgois/proyecto-tesis>.
2. Tocá el botón verde **Code** → **Download ZIP**.
3. Descomprimí el ZIP en el Escritorio (clic derecho → **Extraer todo**).
4. La carpeta se llama `proyecto-tesis-main`: cambiale el nombre a **`proyecto-tesis`**.
5. En PowerShell, escribí `cd Desktop` y apretá **Enter**.

En los dos casos, en el Escritorio queda la carpeta **`proyecto-tesis`**.

> Si tu Escritorio está en OneDrive y `cd Desktop` da error, usá `cd OneDrive\Escritorio`.

**No cierres esta ventana**: la vas a usar en el paso 4.

### Paso 3. Crear la base de datos (con pgAdmin)

1. Abrí **pgAdmin** desde el menú Inicio.
2. En el panel de la izquierda, hacé clic en **Servers** y después en **PostgreSQL**. Te pide la contraseña que anotaste en el paso 1.
3. Hacé clic derecho en **Databases → Create → Database…**
4. En **Database** escribí `club_sportivo_sc` y tocá **Save**.
5. Hacé clic en la base nueva `club_sportivo_sc` para seleccionarla y abrí el menú **Tools → Query Tool**.
6. En la ventana que se abre, tocá el **ícono de la carpeta** (Open File), buscá la carpeta `proyecto-tesis\documentos` en tu Escritorio y abrí **`esquema.sql`**.
7. Apretá **F5** para ejecutarlo. Abajo tiene que decir que terminó sin errores.
8. Repetí los pasos 6 y 7 con el archivo **`juego_de_datos.sql`**, de la misma carpeta.

Listo: la base tiene las tablas y los datos de prueba.

### Paso 4. Preparar y arrancar el servidor

Volvé a la ventana de PowerShell del paso 2.

1. Entrá a la carpeta del servidor:

   ```bash
   cd proyecto-tesis\codigo\backend
   ```

2. Instalá lo que necesita (tarda un minuto):

   ```bash
   npm install
   ```

3. Creá el archivo de configuración `.env`, copiando el de ejemplo:

   ```bash
   copy .env.example .env
   ```

   (En Mac o Linux: `cp .env.example .env`)

4. Abrí el archivo para completarlo:

   ```bash
   notepad .env
   ```

   (En Mac: `open -e .env`)

5. Dejá el archivo así. Solo hay que cambiar **dos valores**: `DB_PASSWORD` y `JWT_SECRET`.

   ```
   PORT=3000
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=tu_contraseña_de_postgres
   DB_NAME=club_sportivo_sc
   JWT_SECRET=una_frase_larga_y_secreta
   JWT_EXPIRES=1h
   CORS_ORIGIN=http://localhost:5173
   ```

   - **`DB_PASSWORD`**: reemplazá `tu_contraseña_de_postgres` por la contraseña que anotaste en el paso 1.
   - **`JWT_SECRET`**: reemplazá `una_frase_larga_y_secreta` por cualquier frase larga que inventes. Sirve para firmar las sesiones; no hace falta recordarla.
   - El resto queda igual. Escribí cada valor después del `=`, sin espacios ni comillas.

   Guardá con **Ctrl + S** y cerrá el Bloc de notas.

   > El `.env` tiene contraseñas: por eso no se sube al repositorio.

6. Arrancá el servidor:

   ```bash
   npm run dev
   ```

   Tiene que aparecer:

   ```
   Servidor corriendo en http://localhost:3000
   Conexión a PostgreSQL OK
   ```

**No cierres esta ventana**: mientras esté abierta, el servidor funciona.

### Paso 5. Arrancar el sitio

1. Abrí **otra** ventana de PowerShell, igual que en el paso 2.
2. Entrá a la carpeta del sitio:

   ```bash
   cd Desktop\proyecto-tesis\codigo\frontend
   ```

   (Si en el paso 2 usaste `cd OneDrive\Escritorio`, acá es `cd OneDrive\Escritorio\proyecto-tesis\codigo\frontend`.)

3. Instalá lo que necesita y arrancalo:

   ```bash
   npm install
   npm run dev
   ```

4. Abrí el navegador (Chrome, Edge o Firefox) y entrá a: **http://localhost:5173**

Las dos ventanas de PowerShell tienen que quedar abiertas: el sitio (puerto 5173) le pide los datos al servidor (puerto 3000).

### Para cerrar todo

En cada ventana de PowerShell apretá **Ctrl + C**. La próxima vez solo hace falta repetir `npm run dev` en cada carpeta: los pasos 1 a 3 y la instalación no se repiten.

### Opcional: el sitio compilado

Así queda el sitio como se publicaría: un solo programa en el puerto 3000 que entrega el sitio y la API juntos. Solo se compila el frontend; el backend se arranca tal cual.

1. Cerrá las dos ventanas anteriores con **Ctrl + C**.
2. En una ventana de PowerShell, desde la carpeta `proyecto-tesis`:

   ```bash
   cd codigo\frontend
   npm run build
   cd ..\backend
   npm start
   ```

3. Entrá a: **http://localhost:3000**

Si cambiás algo del frontend, volvé a correr `npm run build` para verlo.

---

## Usuarios de prueba

La contraseña de todos es `123456`. Se puede ingresar con el email o con el DNI.

| Rol | Email | DNI |
|---|---|---|
| Administrador | `admin@sportivosc.com` | `20111222` |
| Socio con cuotas pagas | `juan.perez@email.com` | `35123456` |
| Socio con cuotas pendientes | `maria.gomez@email.com` | `38987654` |

## Si algo falla

| Qué pasa | Qué hacer |
|---|---|
| `node` o `npm` no se reconoce | Reiniciá la computadora después de instalar Node.js (paso 1) |
| `No se pudo conectar a la base` | Revisá `DB_PASSWORD` y `DB_NAME` en el `.env` (paso 4) |
| `relation "socio" does not exist` | Faltó ejecutar `esquema.sql` (paso 3) |
| `Could not read package.json` | La terminal no está en la carpeta correcta: revisá el `cd` del paso 4 o 5 |
| El sitio dice que no puede conectar con el servidor | La ventana del servidor está cerrada: volvé al paso 4.6 |
| `EADDRINUSE` | Ya hay otro servidor abierto: cerralo con **Ctrl + C** |
| En `localhost:3000` aparece un error de `dist/index.html` | Falta compilar el sitio: `npm run build` en `codigo\frontend` |

## API y colección de pruebas

- La especificación de la API está en `documentos/especificacion_api.md`.
- La colección de pruebas está en `codigo/backend/coleccion_pruebas.http`. Se ejecuta en VS Code con la extensión **REST Client**: con el servidor corriendo, tocá **Send Request** en cada pedido, de arriba hacia abajo.

## Verificado en otra computadora

Comprobamos estos pasos desde cero el 22/11/2026, en Windows: descargamos el repositorio en una carpeta nueva, creamos la base con los scripts de `documentos/`, armamos el `.env` a partir del `.env.example` y arrancamos el servidor y el sitio sin usar ningún archivo de nuestra carpeta de trabajo.