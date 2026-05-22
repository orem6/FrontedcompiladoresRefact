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

export const defaultMongo = `db.orders.aggregate([
  { "$match": { "status": "active" } },
  { "$group": { "_id": "$category", "total": { "$sum": 1 } } }
])`;

export const defaultMongoPipeline = `[
  { "$match": { "status": "active" } },
  { "$group": { "_id": "$category", "total": { "$sum": 1 } } }
]`;
