# PokéDashboard Frontend (Vue.js + Pinia + JWT)

Frontend web application built with **Vue 3**, **Vite**, **Pinia**, and **Tailwind CSS** for managing a Pokémon catalog with centralized **LDAP** authentication and automatic **JWT** injection as a Bearer Token on all HTTP requests.

## Features

- 🔐 **Centralized LDAP Authentication**: Login screen integrated with the LDAP API (`http://localhost:8000/login`).
- 🗄️ **State Management with Pinia**: The JWT returned by the authentication API is stored in Pinia and persisted to `localStorage`.
- 💉 **Automatic Bearer Token Injection**: Axios request interceptor (`src/services/api.js`) automatically appends `Authorization: Bearer <JWT>` to every outgoing request.
- 🛡️ **Fail2Ban DDoS Mitigation**: Packaged with Alpine Nginx and active Fail2Ban jail monitoring HTTP flood attacks.
- 📜 **Detailed Console Logs**: Request interceptor logs HTTP method, URL, and headers for transparent demonstration and verification.
- 🔒 **Navigation Guards**: Route protection (`/dashboard`, `/pokemons/create`) that redirects unauthenticated visitors to `/login`.
- ⚡ **Dynamic Dashboard**: Interactive Pokémon catalog with type filters, live search, and visual base stats.
- ➕ **Pokémon Registration**: Interactive form featuring one-click quick presets, dynamic stat sliders, and real-time sprite preview.

## Requirements

- Node.js 18+ and npm, or Docker

## Setup and Local Execution

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the Vite development server:
   ```bash
   npm run dev
   ```

3. Open in browser:
   `http://localhost:5173`

## Docker Execution

```bash
docker build -t pokemon-frontend .
docker run --cap-add=NET_ADMIN --cap-add=NET_RAW -p 80:80 pokemon-frontend
```

## Demonstration Flow

1. Open the browser developer console (`F12` -> **Console** or **Network** tab).
2. Sign in using an LDAP account (e.g. `alice` / `alice123` or `bob` / `bob123`).
3. Observe the authentication response containing the JWT and how Pinia stores the session.
4. On the Dashboard, verify the `GET /api/pokemons` request and inspect the injected Bearer Token.
5. Navigate to "+ New Pokémon", fill in or select a preset, and submit.
6. Verify the `POST /api/pokemons` request with the Bearer token and confirm the new entry appears in the catalog.
