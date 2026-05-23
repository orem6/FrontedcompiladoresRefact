# SQL/NoSQL Compiler UI

Dashboard para un compilador SQL/NoSQL con analisis lexico, sintactico y semantico. Consume una API REST Spring Boot.

## Requisitos del Sistema

- **Node.js** 18+ (recomendado 22 LTS)
- **npm** 9+ (viene con Node.js)
- **Backend Spring Boot** corriendo en `http://localhost:8080`

## Stack Tecnológico

| Runtime          | Dev               |
| ---------------- | ----------------- |
| React 19         | Vite 8            |
| React DOM 19     | Tailwind CSS v4   |
| Framer Motion 12 | ESLint 10         |
| Lucide React 1   | @tailwindcss/vite |

Lenguaje: **JavaScript (JSX)** — no usa TypeScript.

## Instalación desde Cero

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd FrontedcompiladoresRefact

# 2. Instalar dependencias
npm install

# 3. (Opcional) Configurar variable de entorno
#    Si el backend corre en otro puerto, copiar y editar:
cp .env.example .env

# 4. Iniciar servidor de desarrollo
npm run dev
```

La aplicación se abre en `http://localhost:5173`.

## Variables de Entorno

| Variable       | Valor por defecto | Descripción                  |
| -------------- | ----------------- | ---------------------------- |
| `VITE_API_URL` | `/api`            | URL base del backend (proxy) |

Sin `.env`, Vite proxyea `/api` a `http://localhost:8080` (configurado en `vite.config.js`).

## Scripts

| Comando           | Descripción                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Servidor de desarrollo (Vite)        |
| `npm run build`   | Build de producción a `dist/`        |
| `npm run preview` | Vista previa del build de producción |
| `npm run lint`    | Ejecutar ESLint en todo el proyecto  |
| `npm run test`    | Ejecutar pruebas Vitest              |

## Funcionalidades

- **Editor de instrucciones** con selector de dialecto (MySQL, PostgreSQL, SQL Server, MongoDB, Cassandra CQL)
- **Conexión a BD** mediante formulario con prueba de conexión al backend
- **Analisis lexico/sintactico** sin necesidad de base de datos
- **Analisis completo** (lexico + sintactico + semantico) con BD conectada
- **Visualización** en 4 pestañas: Consola, Tokens, Semántico, Errores
- **Indicador visual** de estado de conexión en tiempo real

Motores soportados oficialmente:

- MySQL
- PostgreSQL
- SQL Server
- MongoDB
- Cassandra CQL

## Endpoints del Backend

| Método | Endpoint                               | Uso                         |
| ------ | -------------------------------------- | --------------------------- |
| GET    | `/api/compiler/health`                 | Health check                |
| GET    | `/api/compiler/dialects`               | Listar dialectos soportados |
| POST   | `/api/compiler/analyze/lexical-syntax` | Análisis léxico/sintáctico  |
| POST   | `/api/compiler/analyze/full`           | Análisis completo           |
| POST   | `/api/compiler/connection/validate`    | Validar conexión a BD       |

`/api/compiler/connection/test` es un endpoint antiguo y no se usa en este frontend.

## Estructura del Proyecto

```
FrontedcompiladoresRefact/
├── .env.example          # Variables de entorno (ejemplo)
├── .nvmrc                # Versión de Node.js recomendada
├── index.html            # HTML principal
├── package.json          # Dependencias y scripts
├── vite.config.js        # Configuración de Vite + proxy
├── eslint.config.js      # Configuración de ESLint
├── public/
│   └── favicon.svg
├── src/
│   ├── main.jsx          # Entry point React
│   ├── App.jsx           # Componente raíz (orquestador)
│   ├── index.css         # Estilos globales + Tailwind + tema
│   ├── components/
│   │   ├── layout/
│   │   │   └── Header.jsx
│   │   └── dashboard/
│   │       ├── SqlEditor.jsx
│   │       ├── ConnectionPanel.jsx
│   │       └── ResultTabs.jsx
│   ├── data/
│   │   └── mockData.js
│   └── services/
│       └── api.js
└── docs/
    ├── ESTRUCTURA_FRONTEND.md
    └── CONEXION_FRONTEND_BACKEND.md
```

## Solución de Problemas

| Problema                      | Causa probable                 | Solución                                             |
| ----------------------------- | ------------------------------ | ---------------------------------------------------- |
| `npm install` falla           | Node.js versión incorrecta     | Usar Node.js 18+ (`nvm use` si tienes `.nvmrc`)      |
| Error de conexión al analizar | Backend no está corriendo      | Iniciar el backend Spring Boot en `:8080`            |
| CORS en consola del navegador | Backend sin configuración CORS | El proxy de Vite lo maneja en desarrollo             |
| Puerto ocupado                | Otro proceso en `:5173`        | `npx vite --port 3000` o cambiar en `vite.config.js` |

## Tests

El proyecto usa Vitest + Testing Library.

## Enlace al backend

La guía de instalación y ejecucion asi como tambien el proyecto del backend se encuentra en el siguiente repositorio:
`https://github.com/orem6/compiladoresRefact.git`
