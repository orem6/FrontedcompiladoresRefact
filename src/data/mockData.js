export const dialects = ['MySQL', 'PostgreSQL', 'SQL Server'];

export const defaultSql = `SELECT c.id, c.nombre, COUNT(p.id) AS total_pedidos
FROM clientes c
LEFT JOIN pedidos p ON p.cliente_id = c.id
WHERE c.estado = 1
GROUP BY c.id, c.nombre
ORDER BY c.nombre ASC;`;
