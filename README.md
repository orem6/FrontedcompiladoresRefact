# SQL Compiler UI

Dashboard visual para un compilador SQL con análisis léxico, sintáctico y semántico. Conectado al backend Spring Boot REST API.

## Tecnologías

- **React** — Librería de UI
- **Vite** — Bundler y dev server
- **TailwindCSS v4** — Estilos utilitarios
- **Framer Motion** — Animaciones
- **Lucide React** — Iconos

## Requisitos

- Node.js 18+
- Backend Spring Boot corriendo en `http://localhost:8080`

## Instalación

```bash
cd FrontedcompiladoresRefact
npm install
npm run dev
```

El frontend inicia en `http://localhost:5173`. Las peticiones a `/api` se proxy al backend.

## Funcionalidades

- **Editor SQL** con resaltado de sintaxis (textarea) y selector de dialecto (MySQL, PostgreSQL, SQL Server)
- **Conexión a BD** con formulario de parámetros y prueba de conexión al backend
- **Análisis léxico/sintáctico** sin necesidad de base de datos
- **Análisis semántico completo** contra base de datos real (requiere conexión)
- **Visualización de resultados** en 4 tabs: Consola, Tokens, Semántico, Errores
- **Indicador de estado de conexión** en tiempo real

## Scripts

```bash
npm run dev      # Servidor de desarrollo (http://localhost:5173)
npm run build    # Build de producción
npm run preview  # Vista previa del build
npm run lint     # ESLint
```

## Estructura

```
src/
├── components/
│   ├── layout/         # Header con estado de conexión
│   └── dashboard/      # SqlEditor, ConnectionPanel, ResultTabs
├── services/           # Capa de servicios HTTP (api.js)
├── data/               # Datos mock (dialectos, SQL default)
├── App.jsx             # Orquestador principal
├── main.jsx            # Entry point
└── index.css           # Estilos globales y tema
```

## Endpoints del Backend Consumidos

| Endpoint | Uso |
|---|---|
| `GET /api/compiler/health` | Health check |
| `GET /api/compiler/dialects` | Listar dialectos |
| `POST /api/compiler/analyze/lexical-syntax` | Análisis léxico/sintáctico |
| `POST /api/compiler/analyze/full` | Análisis completo con semántica |
| `POST /api/compiler/connection/test` | Prueba de conexión a BD |

## Configuración

Crear archivo `.env` en la raíz (ya incluido):

```env
VITE_API_URL=http://localhost:8080
```

Si el backend corre en otro puerto, cambiar el valor. En desarrollo también funciona con el proxy de Vite configurado en `vite.config.js`.
