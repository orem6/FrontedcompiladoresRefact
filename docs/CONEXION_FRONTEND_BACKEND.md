# Conexion Frontend-Backend

## Servicios API usados

| Funcion | Metodo | Endpoint |
|---|---|---|
| `checkHealth()` | GET | `/api/compiler/health` |
| `getDialects()` | GET | `/api/compiler/dialects` |
| `validateConnection(config)` | POST | `/api/compiler/connection/validate` |
| `analyzeLexicalSyntax(payload)` | POST | `/api/compiler/analyze/lexical-syntax` |
| `analyzeFull(payload)` | POST | `/api/compiler/analyze/full` |

## Flujo principal

1. Usuario selecciona dialecto oficial.
2. Si conecta correctamente, `ConnectionPanel` entrega `connectionConfig` a `App`.
3. Si hay conexion valida del mismo dialecto, `App` usa `/analyze/full`.
4. Si no hay conexion valida, `App` usa `/analyze/lexical-syntax`.
5. Para MongoDB pipeline puro (`[` al inicio), FULL exige `targetCollection`.

## Contrato de conexion

`validateConnection` envia:

```json
{
  "dialect": "CASSANDRA_CQL",
  "host": "localhost",
  "port": 9042,
  "database": "demo",
  "schema": null,
  "username": "cassandra",
  "password": "cassandra",
  "jdbcUrl": null,
  "useDirectJdbcUrl": false,
  "localDatacenter": "datacenter1"
}
```

## Seguridad

- Password solo vive en memoria React.
- No se guarda en `localStorage` ni en `sessionStorage`.
- No se imprime password en consola.
