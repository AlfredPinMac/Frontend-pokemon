# PokéDashboard Frontend (Vue.js + Pinia + JWT)

Aplicación Web Frontend desarrollada con **Vue 3**, **Vite**, **Pinia** y **Tailwind CSS** para la gestión de un catálogo de Pokémones con autenticación centralizada **LDAP** e inyección automática de **JWT** como Bearer Token en todas las peticiones HTTP.

## Características

- 🔐 **Autenticación Centralizada LDAP**: Pantalla de Login conectada al API de LDAP (`http://localhost:8000/login`).
- 🗄️ **Gestión de Estado con Pinia**: El JWT retornado por el API se almacena en un store de Pinia y se persiste en `localStorage`.
- 💉 **Inyección Automática de Bearer Token**: Interceptor de Axios (`src/services/api.js`) que inyecta `Authorization: Bearer <JWT>` en cada petición saliente.
- 📜 **Logs Detallados en Consola**: Cada petición imprime en consola (`console.group` / `console.log`) el método HTTP, URL, encabezados y el Bearer Token para facilitar la demostración en video.
- 🛡️ **Navigation Guards**: Protección de rutas (`/dashboard`, `/pokemons/create`) que redirigen a `/login` si el usuario no cuenta con un token activo.
- ⚡ **Dashboard Dinámico**: Listado de Pokémones con tarjetas interactivas, filtros por tipo, barra de búsqueda y estadísticas.
- ➕ **Alta de Pokémones**: Formulario interactivo con plantillas rápidas y vista previa en tiempo real. Los nuevos elementos se reflejan inmediatamente en el Dashboard tras el `POST /api/pokemons`.

## Requisitos

- Node.js 18+ y npm

## Instalación y Ejecución

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Iniciar servidor de desarrollo Vite:
   ```bash
   npm run dev
   ```

3. Abrir en el navegador:
   `http://localhost:5173`

## Demostración en Video

1. Abrir la consola de desarrollador del navegador (`F12` -> pestaña **Console** o pestaña **Network**).
2. Iniciar sesión con un usuario de LDAP (ej. `alice` / `alice123` o `bob` / `bob123`).
3. Observar cómo se recibe el JWT y se guarda en el store de Pinia.
4. En el Dashboard, observar el `GET /api/pokemons` y cómo en la consola se imprime el `Authorization: Bearer <token>`.
5. Ir a "+ Nuevo Pokémon", registrar uno nuevo y enviarlo.
6. Observar el `POST /api/pokemons` con el token Bearer y cómo el nuevo Pokémon aparece de inmediato en el listado del Dashboard.
