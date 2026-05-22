# PROMPT 08 PARA AGENTE PROGRAMADOR
## Adecuación completa del Frontend React al contrato final del Backend SQL/NoSQL

> **Proyecto frontend:** `FrontedcompiladoresRefact`  
> **Stack:** React 19 + Vite + Tailwind CSS + JavaScript/JSX  
> **Backend objetivo:** Spring Boot REST API del compilador SQL/NoSQL  
> **Ruta base API:** `/api/compiler`  
> **Objetivo:** Ajustar el frontend al contrato final limpio del backend, integrando correctamente SQL, MongoDB y Cassandra CQL, con conexión dinámica, análisis léxico/sintáctico, análisis full/semántico, visualización completa de resultados, documentación y pruebas.

---

# 1. Contexto general

El frontend actual ya es una aplicación React con Vite. Tiene una interfaz funcional con:

```text
src/App.jsx
src/services/api.js
src/components/layout/Header.jsx
src/components/dashboard/SqlEditor.jsx
src/components/dashboard/ConnectionPanel.jsx
src/components/dashboard/ResultTabs.jsx
src/data/mockData.js
```

También existen documentos:

```text
docs/CONEXION_FRONTEND_BACKEND.md
docs/ESTRUCTURA_FRONTEND.md
README.md
```

El backend evolucionó y ahora el frontend debe ajustarse al contrato final limpio para motores SQL y NoSQL.

Motores soportados oficialmente por el backend:

```text
MYSQL
POSTGRESQL
SQL_SERVER
MONGODB
CASSANDRA_CQL
```

Endpoints oficiales:

```http
GET  /api/compiler/health
GET  /api/compiler/dialects
POST /api/compiler/analyze/lexical-syntax
POST /api/compiler/analyze/full
POST /api/compiler/connection/validate
```

Endpoint antiguo que debe dejar de usarse:

```http
POST /api/compiler/connection/test
```

---

# 2. Estado actual detectado del frontend

El frontend actual tiene puntos que deben corregirse:

## 2.1 Dialecto Cassandra incorrecto

Actualmente aparece:

```js
'Cassandra'
```

y se convierte a:

```text
CASSANDRA
```

Pero el contrato final del backend exige:

```text
CASSANDRA_CQL
```

Corregir toda referencia a:

```text
CASSANDRA
```

en contexto de API pública, para usar:

```text
CASSANDRA_CQL
```

---

## 2.2 Endpoint de conexión antiguo

Actualmente `src/services/api.js` usa:

```js
POST /api/compiler/connection/test
```

Debe cambiar a:

```js
POST /api/compiler/connection/validate
```

La función `testConnection` debe renombrarse a:

```js
validateConnection
```

Si se mantiene un alias temporal, debe estar marcado como deprecated y no ser usado por los componentes.

---

## 2.3 Puertos por defecto

Actualmente el frontend ya maneja algunos puertos, pero debe quedar formalmente así:

```text
MYSQL         -> 3306
POSTGRESQL    -> 5432
SQL_SERVER    -> 1433
MONGODB       -> 27017
CASSANDRA_CQL -> 9042
```

Al cambiar motor, el puerto debe actualizarse automáticamente.

---

## 2.4 Credenciales NoSQL

Actualmente el frontend oculta usuario/contraseña cuando el dialecto no es SQL.

Eso debe corregirse.

MongoDB y Cassandra pueden requerir usuario y contraseña.

Regla:

```text
Los campos Usuario y Contraseña deben mostrarse para SQL, MongoDB y Cassandra CQL.
```

Pueden ser opcionales en MongoDB, pero deben estar disponibles.

No guardar credenciales en localStorage/sessionStorage.

No imprimir password en consola.

No mostrar password en resultados.

---

## 2.5 MongoDB con pipeline puro

El editor actual muestra ejemplos MongoDB como pipeline puro:

```javascript
[
  { "$match": { "status": "active" } },
  { "$group": { "_id": "$category", "total": { "$sum": 1 } } }
]
```

Ese formato no incluye colección.

Para análisis semántico `FULL`, el backend necesita una colección objetivo.

El frontend debe soportar un campo:

```text
targetCollection
```

Este campo solo debe mostrarse cuando:

```text
dialect = MONGODB
```

Debe ser obligatorio para análisis `FULL` si la consulta empieza con `[` o parece pipeline puro.

No debe ser obligatorio para análisis léxico/sintáctico.

No debe ser obligatorio si la instrucción MongoDB ya tiene formato completo:

```javascript
db.orders.aggregate([...])
db.orders.find({ status: "active" })
```

---

## 2.6 Resultados semánticos incompletos

`ResultTabs.jsx` actualmente muestra `semantic.errors` y `semantic.warnings`, pero no renderiza adecuadamente:

```text
semantic.validatedObjects
```

El backend puede devolver objetos validados para:

```text
SQL:
- tables
- columns
- functions
- aliases

MongoDB:
- databases
- collections
- fields
- operators

Cassandra CQL:
- keyspaces
- tables
- columns
- rules
```

El frontend debe mostrar esos objetos de forma clara y genérica.

---

# 3. Contrato final del backend que debe consumir el frontend

## 3.1 Base URL

El frontend debe seguir usando:

```js
const BASE_URL = import.meta.env.VITE_API_URL || '/api';
const API_PREFIX = `${BASE_URL}/compiler`;
```

En desarrollo, Vite debe seguir usando proxy:

```js
'/api' -> 'http://localhost:8080'
```

---

## 3.2 Health

```http
GET /api/compiler/health
```

Uso:

```text
Verificar disponibilidad del backend.
```

---

## 3.3 Dialects

```http
GET /api/compiler/dialects
```

Respuesta esperada:

```json
{
  "supportedDialects": [
    "MYSQL",
    "POSTGRESQL",
    "SQL_SERVER",
    "MONGODB",
    "CASSANDRA_CQL"
  ],
  "sqlDialects": [
    "MYSQL",
    "POSTGRESQL",
    "SQL_SERVER"
  ],
  "noSqlDialects": [
    "MONGODB",
    "CASSANDRA_CQL"
  ],
  "futureDialects": []
}
```

El frontend puede usar valores locales como fallback, pero debe estar preparado para consumir `/dialects`.

---

## 3.4 Validate connection

Endpoint oficial:

```http
POST /api/compiler/connection/validate
```

Request SQL/MongoDB/Cassandra CQL:

```json
{
  "dialect": "MONGODB",
  "host": "localhost",
  "port": 27017,
  "database": "orders_db",
  "schema": null,
  "username": "",
  "password": "",
  "jdbcUrl": "",
  "useDirectJdbcUrl": false,
  "localDatacenter": null
}
```

Para Cassandra CQL:

```json
{
  "dialect": "CASSANDRA_CQL",
  "host": "localhost",
  "port": 9042,
  "database": "demo",
  "schema": null,
  "username": "cassandra",
  "password": "cassandra",
  "localDatacenter": "datacenter1"
}
```

Respuesta esperada:

```json
{
  "valid": true,
  "message": "Conexión validada correctamente.",
  "executionStatus": "SUCCESS",
  "connectionResult": {
    "connected": true,
    "dialect": "MONGODB",
    "database": "orders_db",
    "host": "localhost",
    "port": 27017,
    "message": "Conexión establecida correctamente."
  },
  "errors": [],
  "console": []
}
```

Si falla conexión:

```text
HTTP 200
valid = false
executionStatus = CONNECTION_ERROR
```

Si el request es inválido:

```text
HTTP 400
executionStatus = INVALID_REQUEST
```

---

## 3.5 Analyze lexical/syntax

Endpoint:

```http
POST /api/compiler/analyze/lexical-syntax
```

Request:

```json
{
  "requestId": "REQ-001",
  "dialect": "MONGODB",
  "sql": "db.orders.find({ status: \"active\" })",
  "analysisMode": "LEXICAL_SYNTAX",
  "targetCollection": null,
  "options": {
    "includeCommentsAsTokens": true,
    "validateSemantic": false,
    "stopOnLexicalError": true,
    "stopOnSyntaxError": true,
    "returnTokenList": true,
    "returnConsoleOutput": true
  }
}
```

Reglas:

```text
LEXICAL_ONLY y LEXICAL_SYNTAX son válidos.
FULL y SEMANTIC_ONLY no deben enviarse a este endpoint.
No requiere conexión.
semanticResult debe venir null.
connectionResult debe venir null.
```

---

## 3.6 Analyze full

Endpoint:

```http
POST /api/compiler/analyze/full
```

Request:

```json
{
  "requestId": "REQ-001",
  "dialect": "MONGODB",
  "sql": "db.orders.aggregate([{ \"$match\": { \"status\": \"active\" } }])",
  "analysisMode": "FULL",
  "targetCollection": null,
  "connectionConfig": {
    "dialect": "MONGODB",
    "host": "localhost",
    "port": 27017,
    "database": "orders_db",
    "schema": null,
    "username": "",
    "password": "",
    "jdbcUrl": "",
    "useDirectJdbcUrl": false,
    "localDatacenter": null
  },
  "options": {
    "includeCommentsAsTokens": true,
    "validateSemantic": true,
    "stopOnLexicalError": true,
    "stopOnSyntaxError": true,
    "returnTokenList": true,
    "returnConsoleOutput": true
  }
}
```

MongoDB con pipeline puro:

```json
{
  "requestId": "REQ-001",
  "dialect": "MONGODB",
  "sql": "[{ \"$match\": { \"status\": \"active\" } }]",
  "analysisMode": "FULL",
  "targetCollection": "orders",
  "connectionConfig": {
    "dialect": "MONGODB",
    "host": "localhost",
    "port": 27017,
    "database": "orders_db",
    "username": "",
    "password": ""
  }
}
```

Reglas:

```text
Este endpoint solo debe recibir analysisMode = FULL.
Requiere conexión validada o configuración de conexión disponible.
No enviar FULL a /analyze/lexical-syntax.
No enviar LEXICAL_SYNTAX a /analyze/full.
```

---

# 4. Cambios requeridos en `src/data/mockData.js`

Reemplazar la lista de dialectos string por una estructura formal.

Ejemplo:

```js
export const DIALECTS = [
  {
    label: 'MySQL',
    value: 'MYSQL',
    family: 'SQL',
    defaultPort: '3306',
    defaultDatabaseLabel: 'Base de datos',
    defaultUser: 'root',
  },
  {
    label: 'PostgreSQL',
    value: 'POSTGRESQL',
    family: 'SQL',
    defaultPort: '5432',
    defaultDatabaseLabel: 'Base de datos',
    defaultSchema: 'public',
    defaultUser: 'postgres',
  },
  {
    label: 'SQL Server',
    value: 'SQL_SERVER',
    family: 'SQL',
    defaultPort: '1433',
    defaultDatabaseLabel: 'Base de datos',
    defaultSchema: 'dbo',
    defaultUser: 'sa',
  },
  {
    label: 'MongoDB',
    value: 'MONGODB',
    family: 'NOSQL',
    defaultPort: '27017',
    defaultDatabaseLabel: 'Database',
    defaultUser: '',
    supportsTargetCollection: true,
  },
  {
    label: 'Cassandra CQL',
    value: 'CASSANDRA_CQL',
    family: 'NOSQL',
    defaultPort: '9042',
    defaultDatabaseLabel: 'Keyspace',
    defaultUser: 'cassandra',
    defaultLocalDatacenter: 'datacenter1',
  },
];
```

Mantener defaults:

```js
defaultSql
defaultCql
defaultMongo
```

Pero cambiar MongoDB default preferido a instrucción completa para que el full funcione sin campo adicional:

```js
export const defaultMongo = `db.orders.aggregate([
  { "$match": { "status": "active" } },
  { "$group": { "_id": "$category", "total": { "$sum": 1 } } }
])`;
```

Agregar también ejemplo de pipeline puro en ayuda.

---

# 5. Cambios requeridos en `src/services/api.js`

Actualizar funciones.

## 5.1 Función base de request

Debe seguir controlando errores HTTP.

Mejorar para preservar response de backend cuando sea posible:

```js
async function request(url, options = {}) {
  const { headers: customHeaders, ...rest } = options;
  const res = await fetch(url, {
    ...rest,
    headers: { 'Content-Type': 'application/json', ...customHeaders },
  });

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    const message = body?.message || `HTTP ${res.status}: ${res.statusText}`;
    const error = new Error(message);
    error.status = res.status;
    error.body = body;
    throw error;
  }

  return body;
}
```

---

## 5.2 Renombrar `testConnection`

Eliminar uso de:

```js
testConnection
/api/compiler/connection/test
```

Crear:

```js
export function validateConnection(config) {
  return request(`${API_PREFIX}/connection/validate`, {
    method: 'POST',
    body: JSON.stringify(config),
  });
}
```

---

## 5.3 `analyzeLexicalSyntax`

Actualizar firma:

```js
export function analyzeLexicalSyntax({ sql, dialect, mode = 'LEXICAL_SYNTAX', targetCollection = null, options = {} })
```

Body:

```js
{
  requestId: crypto.randomUUID?.() || `REQ-${Date.now()}`,
  dialect,
  sql,
  analysisMode: mode,
  targetCollection,
  options: {
    includeCommentsAsTokens: true,
    validateSemantic: false,
    stopOnLexicalError: true,
    stopOnSyntaxError: true,
    returnTokenList: true,
    returnConsoleOutput: true,
    ...options,
  },
}
```

---

## 5.4 `analyzeFull`

Actualizar firma:

```js
export function analyzeFull({ sql, dialect, connectionConfig, targetCollection = null, options = {} })
```

Body:

```js
{
  requestId: crypto.randomUUID?.() || `REQ-${Date.now()}`,
  dialect,
  sql,
  analysisMode: 'FULL',
  targetCollection,
  connectionConfig,
  options: {
    includeCommentsAsTokens: true,
    validateSemantic: true,
    stopOnLexicalError: true,
    stopOnSyntaxError: true,
    returnTokenList: true,
    returnConsoleOutput: true,
    ...options,
  },
}
```

---

# 6. Cambios requeridos en `src/App.jsx`

## 6.1 Estado global

Agregar estado para:

```js
selectedDialect
targetCollection
connectionConfig
connectionStatus
connectionResult
response
loading
globalError
```

## 6.2 Validar conexión contra dialecto seleccionado

Si hay conexión activa para un dialecto y el usuario cambia el motor, debe ocurrir una de estas dos opciones:

Opción recomendada:

```text
Desconectar automáticamente y mostrar mensaje:
"Se cambió el motor de base de datos. La conexión anterior fue descartada."
```

No permitir usar una conexión MySQL para MongoDB o una conexión MongoDB para Cassandra.

---

## 6.3 Flujo de análisis

Regla:

```text
Si connectionStatus = conectado y connectionConfig.dialect = selectedDialect:
    usar /analyze/full
Si no:
    usar /analyze/lexical-syntax
```

Para MongoDB pipeline puro:

```js
const isMongoPipeline = dialect === 'MONGODB' && sql.trim().startsWith('[');
```

Si:

```text
isMongoPipeline = true
connectionStatus = conectado
targetCollection vacío
```

mostrar error visual:

```text
Para análisis semántico de un pipeline MongoDB puro debe ingresar la colección objetivo.
```

No enviar request full hasta que exista `targetCollection`.

Para léxico/sintáctico sin conexión, permitir pipeline puro sin `targetCollection`.

---

## 6.4 Mantener password solo en memoria

No guardar password en localStorage.

No imprimir `connectionConfig` con password en consola.

No mostrar password en `ResultTabs`.

---

# 7. Cambios requeridos en `SqlEditor.jsx`

## 7.1 Usar dialectos formales

Ya no convertir con:

```js
const val = d === 'SQL Server' ? 'SQL_SERVER' : d.toUpperCase();
```

Usar directamente:

```js
DIALECTS.map(d => <option value={d.value}>{d.label}</option>)
```

---

## 7.2 Actualizar defaults por dialecto

Debe usar:

```text
MYSQL/POSTGRESQL/SQL_SERVER -> defaultSql
CASSANDRA_CQL -> defaultCql
MONGODB -> defaultMongo
```

---

## 7.3 Campo targetCollection

Agregar un campo opcional debajo del editor cuando:

```text
dialect = MONGODB
```

Label:

```text
Colección objetivo
```

Placeholder:

```text
orders
```

Ayuda visual:

```text
Necesario para análisis semántico cuando se usa un pipeline MongoDB puro sin db.collection.aggregate(...).
```

Enviar el valor hacia `App.jsx`.

---

## 7.4 Ayuda de ejemplos

Actualizar modal de ayuda para incluir:

```text
SQL
Cassandra CQL
MongoDB instrucción completa
MongoDB pipeline puro
```

Ejemplos MongoDB:

```javascript
db.orders.find({ status: "active" })

db.orders.aggregate([
  { "$match": { "status": "active" } },
  { "$group": { "_id": "$category", "total": { "$sum": 1 } } }
])

[
  { "$match": { "status": "active" } },
  { "$group": { "_id": "$category", "total": { "$sum": 1 } } }
]
```

---

# 8. Cambios requeridos en `ConnectionPanel.jsx`

## 8.1 Usar `validateConnection`

Cambiar import:

```js
import { validateConnection } from '../../services/api';
```

No usar:

```js
testConnection
```

---

## 8.2 Puertos por defecto

Usar configuración centralizada de `DIALECTS`.

Si cambia dialecto:

```text
MYSQL -> 3306
POSTGRESQL -> 5432
SQL_SERVER -> 1433
MONGODB -> 27017
CASSANDRA_CQL -> 9042
```

---

## 8.3 Campos dinámicos

### Todos los motores

Mostrar:

```text
Host
Puerto
Base de datos / Database / Keyspace
Usuario
Contraseña
```

### SQL Server/PostgreSQL opcional

Mostrar `schema` opcional:

```text
POSTGRESQL -> public
SQL_SERVER -> dbo
```

### Cassandra

Mostrar:

```text
Local Datacenter
```

Default:

```text
datacenter1
```

### MongoDB

Mostrar opcionalmente:

```text
URI directa
```

Pero no es obligatorio si no está implementado todavía.

Si se implementa:

```text
useDirectJdbcUrl
jdbcUrl
```

Label recomendado:

```text
URI directa MongoDB
```

---

## 8.4 Construcción de config

La config enviada a `/connection/validate` debe ser:

```js
{
  dialect,
  host,
  port: Number(port),
  database,
  schema: schema || null,
  username,
  password,
  jdbcUrl: jdbcUrl || null,
  useDirectJdbcUrl,
  localDatacenter: dialect === 'CASSANDRA_CQL' ? localDatacenter : null,
}
```

---

## 8.5 Validaciones frontend

Antes de conectar, validar:

```text
dialect requerido
host requerido, salvo URI directa
port requerido y numérico, salvo URI directa
database requerido
localDatacenter requerido para Cassandra CQL
```

Usuario/contraseña pueden ser opcionales para MongoDB, pero deben enviarse si el usuario los llena.

---

## 8.6 Estado de conexión

Manejar:

```text
desconectado
conectando
conectado
error
```

Si la conexión es válida:

```js
onConnectionChange({
  ...config,
  connected: true,
  connectionResult: res.connectionResult,
});
```

Si se desconecta:

```js
onConnectionChange({ connected: false });
```

---

# 9. Cambios requeridos en `Header.jsx`

Actualizar textos:

Actual:

```text
Analizador léxico, sintáctico y semántico para motores SQL.
```

Nuevo:

```text
Analizador léxico, sintáctico y semántico para motores SQL y NoSQL.
```

Estado de conexión debe mostrar:

```text
Conectado
Desconectado
Error de conexión
```

y opcionalmente el dialecto conectado:

```text
Conectado a MongoDB
Conectado a Cassandra CQL
```

---

# 10. Cambios requeridos en `ResultTabs.jsx`

## 10.1 Loading text

Cambiar:

```text
Procesando la consulta SQL.
```

por:

```text
Procesando la instrucción seleccionada.
```

---

## 10.2 SemanticPanel debe mostrar validatedObjects

Agregar render genérico para:

```js
semantic.validatedObjects
```

Debe soportar:

```text
Array
Object
String
Boolean
Number
null
```

Opción recomendada:

Crear un componente:

```js
function ValidatedObjectsPanel({ objects }) { ... }
```

Debe poder mostrar grupos:

```text
tables
columns
functions
aliases
databases
collections
fields
operators
keyspaces
rules
```

Para cada grupo, renderizar tabla dinámica con columnas según keys del objeto.

Ejemplo:

```json
"validatedObjects": {
  "collections": [
    {
      "name": "orders",
      "exists": true,
      "message": "Colección encontrada."
    }
  ],
  "fields": [
    {
      "collection": "orders",
      "name": "status",
      "exists": true,
      "source": "SAMPLE_DOCUMENT"
    }
  ]
}
```

Debe verse como:

```text
Colecciones
name     exists   message
orders   true     Colección encontrada.

Campos
collection   name     exists   source
orders       status   true     SAMPLE_DOCUMENT
```

---

## 10.3 Warnings

Actualmente warnings pueden ser strings.

El backend puede devolver warnings como:

```json
[
  {
    "stage": "SEMANTIC",
    "code": "ALLOW_FILTERING_WARNING",
    "message": "ALLOW FILTERING puede impactar rendimiento.",
    "severity": "WARNING"
  }
]
```

Soportar ambos formatos:

```text
string
object
```

---

## 10.4 ErrorsPanel

Debe incluir errores de:

```text
response.errors
lexicalResult.errors
syntaxResult.errors
semanticResult.errors
semanticResult.warnings con severity WARNING si aplica
```

No duplicar excesivamente si el mismo error aparece en `response.errors` y dentro de una sección.

---

# 11. Manejo de errores HTTP

Cuando `api.js` lance error con `error.body`, `App.jsx` debe mostrar ese body si existe.

Ejemplo:

```js
catch (err) {
  if (err.body) {
    setResponse(normalizeBackendError(err.body, err.message));
  } else {
    setResponse(...)
  }
}
```

Crear helper:

```js
normalizeBackendError(body, fallbackMessage)
```

Debe producir una respuesta compatible con `ResultTabs`.

---

# 12. Limpieza de nomenclatura visual

Cambiar textos donde diga solo SQL si aplica a NoSQL.

Ejemplos:

```text
SQL Compiler -> SQL/NoSQL Compiler
Consulta SQL -> Instrucción
Analizador para motores SQL -> Analizador para motores SQL y NoSQL
Base de datos -> Base de datos / Keyspace según dialecto
```

Puede conservarse el nombre de marca `SQL Compiler` si el equipo quiere, pero los textos funcionales deben mencionar NoSQL.

---

# 13. Pruebas obligatorias

El proyecto actualmente no tiene framework de pruebas configurado.

Agregar pruebas de forma ordenada.

## 13.1 Dependencias sugeridas

Agregar como dev dependencies:

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

Actualizar `package.json`:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "build": "vite build",
    "lint": "eslint ."
  }
}
```

Configurar Vitest en `vite.config.js` o `vitest.config.js`.

---

## 13.2 Tests de servicios API

Crear:

```text
src/services/api.test.js
```

Casos:

```text
validateConnection usa /api/compiler/connection/validate
validateConnection no usa /connection/test
analyzeLexicalSyntax envía analysisMode LEXICAL_SYNTAX
analyzeFull envía analysisMode FULL
analyzeFull incluye connectionConfig
analyzeFull incluye targetCollection cuando se proporciona
```

Mockear `fetch`.

---

## 13.3 Tests de dialectos

Crear:

```text
src/data/dialects.test.js
```

Validar:

```text
MYSQL -> 3306
POSTGRESQL -> 5432
SQL_SERVER -> 1433
MONGODB -> 27017
CASSANDRA_CQL -> 9042
No existe CASSANDRA como value público.
```

---

## 13.4 Tests de ConnectionPanel

Crear:

```text
src/components/dashboard/ConnectionPanel.test.jsx
```

Casos:

```text
Al seleccionar MongoDB, puerto 27017.
Al seleccionar Cassandra CQL, puerto 9042.
Cassandra muestra campo localDatacenter.
MongoDB permite usuario y contraseña.
Botón conectar llama validateConnection.
No se usa /connection/test.
```

---

## 13.5 Tests de SqlEditor

Crear:

```text
src/components/dashboard/SqlEditor.test.jsx
```

Casos:

```text
Muestra dialectos oficiales.
MongoDB muestra targetCollection.
Cassandra usa CASSANDRA_CQL.
Ctrl+Enter ejecuta analyze.
```

---

## 13.6 Tests de ResultTabs

Crear:

```text
src/components/dashboard/ResultTabs.test.jsx
```

Casos:

```text
Renderiza tokens.
Renderiza errores.
Renderiza warnings string.
Renderiza warnings object.
Renderiza validatedObjects para MongoDB.
Renderiza validatedObjects para Cassandra.
```

---

# 14. Comandos obligatorios antes de entregar

Ejecutar:

```bash
npm install
npm run lint
npm run build
npm run test
```

Si alguno falla, corregir antes de entregar.

No entregar si:

```text
lint falla
build falla
tests fallan
sigue usando /connection/test
sigue enviando CASSANDRA en lugar de CASSANDRA_CQL
no muestra targetCollection para MongoDB
no renderiza validatedObjects
```

---

# 15. Documentación obligatoria

Actualizar:

```text
README.md
docs/CONEXION_FRONTEND_BACKEND.md
docs/ESTRUCTURA_FRONTEND.md
```

Crear:

```text
docs/CONTRATO_API_FRONTEND.md
docs/NOSQL_FRONTEND.md
```

---

## 15.1 README.md

Actualizar:

```text
Motores soportados:
- MySQL
- PostgreSQL
- SQL Server
- MongoDB
- Cassandra CQL
```

Actualizar endpoints:

```text
/api/compiler/connection/validate
```

Eliminar o marcar como antiguo:

```text
/api/compiler/connection/test
```

Agregar comandos:

```bash
npm run lint
npm run build
npm run test
```

---

## 15.2 CONEXION_FRONTEND_BACKEND.md

Actualizar tabla de servicios:

```text
checkHealth -> GET /api/compiler/health
getDialects -> GET /api/compiler/dialects
validateConnection -> POST /api/compiler/connection/validate
analyzeLexicalSyntax -> POST /api/compiler/analyze/lexical-syntax
analyzeFull -> POST /api/compiler/analyze/full
```

Documentar request/response actuales.

---

## 15.3 NOSQL_FRONTEND.md

Debe explicar:

1. MongoDB en frontend.
2. Cassandra CQL en frontend.
3. Puertos por defecto.
4. Campo `targetCollection`.
5. Diferencia entre pipeline puro y `db.collection.aggregate`.
6. Conexión dinámica.
7. Análisis léxico/sintáctico sin conexión.
8. Análisis full con conexión.
9. Limitaciones.
10. Ejemplos.

---

# 16. Criterios de aceptación

La implementación se considera correcta si:

1. Frontend compila con `npm run build`.
2. Lint pasa con `npm run lint`.
3. Tests pasan con `npm run test`.
4. `validateConnection` usa `/api/compiler/connection/validate`.
5. No se usa `/api/compiler/connection/test`.
6. Los dialectos oficiales son:
   - `MYSQL`
   - `POSTGRESQL`
   - `SQL_SERVER`
   - `MONGODB`
   - `CASSANDRA_CQL`
7. No se envía `CASSANDRA` al backend.
8. MongoDB usa puerto default `27017`.
9. Cassandra CQL usa puerto default `9042`.
10. SQL Server usa `1433`.
11. PostgreSQL usa `5432`.
12. MySQL usa `3306`.
13. Usuario/contraseña están disponibles también para MongoDB y Cassandra CQL.
14. MongoDB muestra `targetCollection`.
15. Pipeline puro MongoDB con full exige `targetCollection`.
16. Léxico/sintáctico permite pipeline puro sin `targetCollection`.
17. `analyzeFull` envía `connectionConfig`.
18. `analyzeFull` envía `analysisMode = FULL`.
19. `analyzeLexicalSyntax` envía `analysisMode = LEXICAL_SYNTAX`.
20. `ResultTabs` muestra `validatedObjects`.
21. `ResultTabs` soporta warnings como string y como object.
22. Documentación actualizada.
23. No se guarda password en localStorage/sessionStorage.
24. No se imprime password en consola.

---

# 17. Orden recomendado de trabajo

1. Revisar `package.json`.
2. Revisar `src/services/api.js`.
3. Revisar `src/data/mockData.js`.
4. Crear estructura formal de dialectos.
5. Corregir endpoint de conexión.
6. Corregir `SqlEditor.jsx`.
7. Agregar `targetCollection`.
8. Corregir `ConnectionPanel.jsx`.
9. Corregir `App.jsx`.
10. Corregir `ResultTabs.jsx`.
11. Actualizar textos visuales.
12. Agregar Vitest y testing utilities.
13. Crear tests de API.
14. Crear tests de dialectos.
15. Crear tests de componentes.
16. Actualizar documentación.
17. Ejecutar `npm run lint`.
18. Ejecutar `npm run build`.
19. Ejecutar `npm run test`.
20. Corregir fallos.
21. Entregar resumen técnico.

---

# 18. Resumen final para el agente

Ajusta el frontend React/Vite al contrato final limpio del backend Spring Boot.

Debes consumir:

```http
GET  /api/compiler/health
GET  /api/compiler/dialects
POST /api/compiler/connection/validate
POST /api/compiler/analyze/lexical-syntax
POST /api/compiler/analyze/full
```

Debes soportar:

```text
MYSQL
POSTGRESQL
SQL_SERVER
MONGODB
CASSANDRA_CQL
```

No uses:

```text
CASSANDRA
/api/compiler/connection/test
```

Agrega `targetCollection` para MongoDB.

Corrige puertos por defecto.

Renderiza resultados semánticos completos, incluyendo `validatedObjects`.

Actualiza documentación.

Agrega pruebas.

No entregues si fallan:

```bash
npm run lint
npm run build
npm run test
```
