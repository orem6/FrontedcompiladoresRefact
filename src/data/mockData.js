export const dialects = ['MySQL', 'PostgreSQL', 'SQL Server', 'Cassandra', 'MongoDB'];

const now = new Date();
const yesterday = new Date(now.getTime() - 86400000).toISOString().split('T')[0];

export const defaultSql = `SELECT c.id, c.nombre, COUNT(p.id) AS total_pedidos
FROM clientes c
LEFT JOIN pedidos p ON p.cliente_id = c.id
WHERE c.estado = 1
GROUP BY c.id, c.nombre
ORDER BY c.nombre ASC;`;

export const defaultCql = `SELECT id, nombre, email
FROM usuarios
WHERE fecha_registro > '${yesterday}'
ALLOW FILTERING;`;

export const defaultMongo = `[
  { "$match": { "status": "active" } },
  { "$group": { "_id": "$category", "total": { "$sum": 1 } } }
]`;
