# Conexión Frontend ↔ Backend

## Resumen

Se integró el frontend React con el backend Spring Boot REST API del compilador SQL. Antes de esta implementación, el frontend era una maqueta visual con datos mock sin ninguna conexión real al backend.

## Capa de Servicios API

Se creó `src/services/api.js` que expone funciones para cada endpoint del backend:

| Función | Método HTTP | Endpoint Backend |
|---|---|---|
| `checkHealth()` | GET | `/api/compiler/health` |
| `getDialects()` | GET | `/api/compiler/dialects` |
| `analyzeLexicalSyntax(sql, dialect, mode, options)` | POST | `/api/compiler/analyze/lexical-syntax` |
| `analyzeFull(sql, dialect, connectionConfig, options)` | POST | `/api/compiler/analyze/full` |
| `testConnection(config)` | POST | `/api/compiler/connection/test` |

Todas las funciones retornan `Promise` con el JSON de respuesta del backend.

## Configuración de Entorno

- Archivo `.env` con `VITE_API_URL=http://localhost:8080`
- Proxy en `vite.config.js` para desarrollo: `/api` → `http://localhost:8080`
- Si no hay `.env`, se usa `/api` como fallback (proxy funcionará igual)

## Flujo de Análisis

1. **Sin conexión a BD**: Al presionar "Analizar", se llama a `/analyze/lexical-syntax` con `LEXICAL_SYNTAX`
2. **Con conexión a BD**: Al presionar "Analizar", se llama a `/analyze/full` con `FULL` + `connectionConfig`

## Flujo de Conexión

1. Usuario llena campos (Host, Puerto, BD, Usuario, Contraseña)
2. Presiona "Conectar" → se llama a `/connection/test`
3. Si es exitoso → estado "Conectado"
4. Si falla → estado "Error de conexión"
5. Presiona "Desconectar" → estado "Desconectado"

## Estados de la UI

El componente `ResultTabs` maneja 3 estados visuales:
- **Empty**: No hay datos (estado inicial)
- **Loading**: Spinner mientras se procesa la solicitud
- **Results**: Datos reales del backend renderizados en tabs

## Mapeo de Componentes

| Componente | Responsabilidad |
|---|---|
| `App.jsx` | Orquestador: estado global, llamadas API, flujo de datos |
| `Header.jsx` | Muestra estado de conexión |
| `SqlEditor.jsx` | Editor SQL + selector de dialecto. Emite `onAnalyze(sql, dialect)` |
| `ConnectionPanel.jsx` | Formulario de conexión. Emite `onConnectionChange(config)` |
| `ResultTabs.jsx` | 4 tabs: Consola, Tokens, Semántico, Errores |

## Archivos Modificados/Creados

| Archivo | Acción |
|---|---|
| `src/services/api.js` | **CREADO** — Capa de servicios HTTP |
| `.env` | **CREADO** — Variable de entorno para API URL |
| `vite.config.js` | **MODIFICADO** — Proxy de desarrollo añadido |
| `public/favicon.svg` | **CREADO** — Favicon |
| `index.html` | **MODIFICADO** — Título actualizado |
| `src/App.jsx` | **MODIFICADO** — Estado global, llamadas API |
| `src/components/layout/Header.jsx` | **MODIFICADO** — Props de conexión |
| `src/components/dashboard/SqlEditor.jsx` | **MODIFICADO** — Dialecto como estado controlado |
| `src/components/dashboard/ConnectionPanel.jsx` | **MODIFICADO** — Inputs controlados + llamada API |
| `src/components/dashboard/ResultTabs.jsx` | **MODIFICADO** — Datos reales + loading/empty states |
