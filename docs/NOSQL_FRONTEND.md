# NoSQL en Frontend

## 1) MongoDB

- Dialecto enviado: `MONGODB`
- Puerto default: `27017`
- Soporta usuario/contrasena opcionales
- Campo adicional: `targetCollection`

## 2) Cassandra CQL

- Dialecto enviado: `CASSANDRA_CQL`
- Puerto default: `9042`
- Soporta usuario/contrasena
- Requiere `localDatacenter` (default `datacenter1`)

## 3) Pipeline puro vs instruccion completa (MongoDB)

- Instruccion completa: `db.orders.aggregate([...])` o `db.orders.find(...)`
- Pipeline puro: inicia con `[` y no incluye coleccion
- Regla: en analisis FULL, pipeline puro requiere `targetCollection`

## 4) Conexion dinamica

- Si se cambia dialecto, se descarta conexion previa.
- No se reutiliza conexion de un dialecto para otro.

## 5) Analisis por modo

- Sin conexion valida: `POST /analyze/lexical-syntax`
- Con conexion valida del mismo dialecto: `POST /analyze/full`

## 6) Limitaciones actuales

- URI directa MongoDB es opcional.
- Si no hay conexion, no hay validacion semantica.

## 7) Ejemplos

MongoDB completo:

```javascript
db.orders.find({ status: "active" })
```

MongoDB pipeline puro:

```javascript
[
  { "$match": { "status": "active" } },
  { "$group": { "_id": "$category", "total": { "$sum": 1 } } }
]
```
