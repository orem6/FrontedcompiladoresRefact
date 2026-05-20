export const dialects = ['MySQL', 'PostgreSQL', 'SQL Server'];

export const defaultSql = `SELECT c.id, c.nombre, COUNT(p.id) AS total_pedidos
FROM clientes c
LEFT JOIN pedidos p ON p.cliente_id = c.id
WHERE c.estado = 1
GROUP BY c.id, c.nombre
ORDER BY c.nombre ASC;`;

export const tokenResults = [
  { tipo: 'PALABRA_RESERVADA', lexema: 'SELECT', linea: 1, columna: 1, motor: 'MySQL' },
  { tipo: 'IDENTIFICADOR', lexema: 'clientes', linea: 2, columna: 6, motor: 'Común SQL' },
];

export const semanticResults = [
  { validacion: 'Tabla', objeto: 'clientes', resultado: 'Existe', detalle: 'Objeto encontrado en metadata JDBC.' },
  { validacion: 'Columna', objeto: 'clientes.nombre', resultado: 'Existe', detalle: 'Columna válida para la tabla indicada.' },
];

export const consoleDefault = `[INFO] Esperando análisis...
[INFO] Seleccione el motor, configure conexión y presione "Analizar".`;
