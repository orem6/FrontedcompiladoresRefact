import { motion } from 'framer-motion';

const DIALECT_LABELS = {
  MYSQL: 'MySQL',
  POSTGRESQL: 'PostgreSQL',
  SQL_SERVER: 'SQL Server',
  MONGODB: 'MongoDB',
  CASSANDRA_CQL: 'Cassandra CQL',
};

export default function Header({ connectionStatus = 'desconectado', connectedDialect = null }) {
  const dotColor = {
    desconectado: 'bg-danger',
    conectando: 'bg-warning',
    conectado: 'bg-success',
    error: 'bg-danger',
  };

  const statusLabel = {
    desconectado: 'Desconectado',
    conectando: 'Conectando...',
    conectado: 'Conectado',
    error: 'Error de conexión',
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="flex items-center justify-between gap-6 mb-5 flex-wrap"
    >
      <div className="flex items-center gap-3.5">
        <div className="w-[46px] h-[46px] rounded-xl bg-primary text-white flex items-center justify-center font-extrabold text-lg tracking-tight shadow-[0_10px_30px_rgba(15,23,42,0.08)] shrink-0">
          SQL
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text leading-tight">SQL Compiler</h1>
          <p className="text-sm text-muted mt-0.5">Analizador lexico, sintactico y semantico para motores SQL y NoSQL.</p>
        </div>
      </div>

      <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-border text-sm text-muted shadow-[0_4px_14px_rgba(15,23,42,0.04)]">
        <span className={`w-[9px] h-[9px] rounded-full ${dotColor[connectionStatus] || 'bg-danger'}`} />
        Estado de conexion:
        <strong className="text-text">
          {connectionStatus === 'conectado' && connectedDialect
            ? `Conectado a ${DIALECT_LABELS[connectedDialect] || connectedDialect}`
            : statusLabel[connectionStatus] || 'Desconectado'}
        </strong>
      </div>
    </motion.header>
  );
}
