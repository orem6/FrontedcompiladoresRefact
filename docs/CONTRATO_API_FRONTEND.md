# Contrato API Frontend

Base URL:

```txt
/api/compiler
```

Endpoints finales consumidos por frontend:

- `GET /api/compiler/health`
- `GET /api/compiler/dialects`
- `POST /api/compiler/connection/validate`
- `POST /api/compiler/analyze/lexical-syntax`
- `POST /api/compiler/analyze/full`

Reglas:

- No usar `/api/compiler/connection/test`.
- No enviar `CASSANDRA`; enviar `CASSANDRA_CQL`.
- `analyze/full` siempre envia `connectionConfig`.
- `analyze/lexical-syntax` no requiere conexion.
- MongoDB pipeline puro en FULL requiere `targetCollection`.
