# VMS-REACT ⚡️

Interfaz web cliente para el backend VMS, construida con **React** y **Vite**. Incluye autenticación con JWT, navegación con React Router, llamadas a la API REST, y notificaciones en tiempo real vía WebSocket.

---

## 📋 Descripción

Este proyecto es el frontend de la plataforma VMS (Vehicle Management System). Permite:

- Registrar y autenticar usuarios.
- CRUD de usuarios y asignación de roles.
- CRUD de máquinas virtuales (VMs).
- Visualizar lista de VMs y detalle de cada VM.
- Notificaciones en tiempo real por eventos (creación, edición, eliminación) usando WebSocket.

Tecnologías principales:

- **React 18** con hooks y contexto.
- **Vite** para desarrollo ultra rápido con HMR.
- **React Router v6** para navegación.
- **ESLint** y **Prettier** para calidad de código.
- **jwt-decode** y **Context API** para gestionar sesión.
- **WebSocket** nativo (wrapped en un provider).  

---

## 🚀 Características

| Componente       | Ruta                   | Descripción                                     |
| ---------------- | ---------------------- | ----------------------------------------------- |
| **Login**        | `/login`               | Formulario de acceso con email y contraseña.    |
| **Register**     | `/register`            | Registro de nuevo usuario.                     |
| **UsersList**    | `/users`               | Listado y edición de usuarios.                  |
| **EditUser**     | `/users/:id/edit`      | Editar datos de usuario.                        |
| **VmsList**      | `/vms`                 | Listado de VMs.                                 |
| **CreateVm**     | `/vms/create`          | Formulario para crear nueva VM.                 |
| **ViewVm**       | `/vms/:id`             | Detalle de una VM existente.                    |
| **EditVm**       | `/vms/:id/edit`        | Actualizar datos de VM.                         |

---

## 📂 Estructura del proyecto

```bash
VMS-REACT/
├── node_modules/          # Dependencias instaladas
├── public/                # Archivos estáticos y configuración de despliegue
│   ├── _redirects
│   └── vite.svg
├── src/                   # Código fuente de la aplicación
│   ├── assets/            # Activos gráficos (imágenes, svg)
│   │   └── react.svg
│   ├── components/        # Componentes React
│   │   ├── CreateVm.jsx
│   │   ├── EditUser.jsx
│   │   ├── EditVm.jsx
│   │   ├── ListVms.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── UsersList.jsx
│   │   └── ViewVms.jsx
│   ├── services/          # Lógica de WebSocket y contexto
│   │   ├── useWebSocket.jsx
│   │   ├── wsContext.jsx
│   │   └── WSProvider.jsx
│   ├── utils/             # Helpers para JWT y llamadas a API
│   │   ├── jwt.jsx
│   │   └── apis.jsx
│   ├── App.jsx            # Componente raíz y definición de rutas
│   ├── App.css            # Estilos específicos de App
│   ├── index.css          # Estilos globales
│   └── main.jsx           # Punto de entrada de React
├── .gitignore             # Archivos y carpetas ignorados por Git
├── eslint.config.js       # Configuración de ESLint
├── index.html             # Plantilla HTML principal
├── package-lock.json      # Versionado de dependencias npm
├── package.json           # Scripts y dependencias del proyecto
├── README.md              # Documentación de este repositorio
└── vite.config.js         # Configuración de Vite
```

---

## ⚙️ Instalación y configuración

1. Clona el repositorio:
   ```bash
   git clone https://github.com/josee2701/VMs-React.git
   cd VMS-REACT
   ```

2. Instala dependencias:
   ```bash
   npm install
   # o yarn install
   ```

---

## ▶️ Desarrollo

Levanta el servidor de desarrollo con HMR:
```bash
npm run dev
# o yarn dev
```
Abre `http://localhost:5173` en tu navegador.

---

## 🛠️ Scripts disponibles

| Script        | Descripción                            |
| ------------- | ---------------------------------------|
| `dev`         | Inicia Vite en modo desarrollo con HMR |
| `build`       | Genera versión optimizada para producción (carpeta `dist/`) |
| `preview`     | Sirve la carpeta `dist/` en un servidor local |
| `lint`        | Ejecuta ESLint para verificar estilo y errores |
| `format`      | Aplica Prettier para formatear código  |

---

## 🔗 Uso de la API

Todas las llamadas utilizan el hook `fetcher` de `src/utils/apis.jsx` y gestionan el token JWT:

$1
### Configuración de `src/utils/apis.jsx`

```js
// src/utils/apis.jsx
import axios from 'axios';
const baseUrl = import.meta.env.VITE_API_URL; // ej. http://localhost:8000
const api = axios.create({ baseURL: baseUrl });

// Inserta el token JWT en cada petición
api.interceptors.request.use(config => {
  const token = localStorage.getItem('jwt');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

### Decodificando el JWT en `src/utils/jwt.jsx`

```js
// src/utils/jwt.jsx
export function parseJwt(token) {
  try {
    const base64 = token.split('.')[1];
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return {};
  }
}
```
Asegúrate de estar autenticado (login) antes de llamar a rutas protegidas.

---

## 💬 WebSocket

El `WSProvider` en `src/services/WSProvider.jsx` y el hook `useWebSocket` permiten suscribirte a eventos:

```js
import { useWebSocket } from "../services/useWebSocket";

function Notifications() {
  const messages = useWebSocket();
  return messages.map((msg, i) => <div key={i}>{msg.event}</div>);
}
```

---

## 📜 Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.

