import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plug, PlugZap } from 'lucide-react';
import { testConnection } from '../../services/api';

const PORTS = { MYSQL: '3306', POSTGRESQL: '5432', SQL_SERVER: '1433' };

export default function ConnectionPanel({ dialect, onConnectionChange }) {
  const [host, setHost] = useState('localhost');
  const [port, setPort] = useState('3306');
  const [database, setDatabase] = useState('');
  const [username, setUsername] = useState('root');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('desconectado');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (PORTS[dialect]) {
      setPort(PORTS[dialect]);
    }
  }, [dialect]);

  const getConfig = () => ({
    dialect,
    host,
    port: parseInt(port, 10) || 3306,
    database,
    username,
    password,
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleConnect = async () => {
    setLoading(true);
    setStatus('conectando');
    setErrorMessage('');
    try {
      const res = await testConnection(getConfig());
      if (res.valid) {
        setStatus('conectado');
        setErrorMessage('');
        if (onConnectionChange) onConnectionChange({ ...getConfig(), connected: true });
      } else {
        setStatus('error');
        setErrorMessage(res.message || 'Error de conexion a la base de datos.');
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message || 'Error de conexion a la base de datos.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    setStatus('desconectado');
    if (onConnectionChange) onConnectionChange({ connected: false });
  };

  const statusColor = {
    desconectado: 'bg-[#fee2e2] text-[#991b1b]',
    conectando: 'bg-[#fef3c7] text-[#92400e]',
    conectado: 'bg-[#dcfce7] text-[#166534]',
    error: 'bg-[#fee2e2] text-[#991b1b]',
  };

  const statusLabel = {
    desconectado: 'Desconectado',
    conectando: 'Conectando...',
    conectado: 'Conectado',
    error: 'Error de conexión',
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className="rounded-[14px] border border-border bg-[rgba(255,255,255,0.94)] shadow-[0_10px_30px_rgba(15,23,42,0.08)] overflow-hidden"
    >
      <div className="px-5 py-[18px] border-b border-border bg-[#fbfdff]">
        <h2 className="text-base font-bold text-text uppercase tracking-[0.4px]">Conexión BD</h2>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-2 gap-3.5">
          <Field label="Host" id="host" value={host} onChange={setHost} placeholder="localhost" />
          <Field label="Puerto" id="port" value={port} onChange={setPort} placeholder="3306" />
          <div className="col-span-2">
            <Field label="Base de datos" id="database" value={database} onChange={setDatabase} placeholder="nombre_base_datos" />
          </div>
          <Field label="Usuario" id="user" value={username} onChange={setUsername} placeholder="root" />
          <Field label="Contraseña" id="password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
        </div>

        <div className="flex items-center justify-between gap-3 mt-[18px] flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={handleConnect}
              disabled={loading || status === 'conectado'}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-[10px] bg-success text-white text-sm font-extrabold hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(15,23,42,0.12)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plug className="w-4 h-4" />
              {loading ? 'Conectando...' : 'Conectar'}
            </button>
            <button
              onClick={handleDisconnect}
              disabled={status !== 'conectado'}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-[10px] bg-danger text-white text-sm font-extrabold hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(15,23,42,0.12)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlugZap className="w-4 h-4" />
              Desconectar
            </button>
          </div>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-extrabold border border-transparent ${statusColor[status]}`}>
            {statusLabel[status]}
          </span>
        </div>

        {errorMessage && (
          <div className="mt-3 p-3 rounded-[10px] bg-[#fee2e2] border border-[#fecaca] text-sm text-[#991b1b]">
            <p className="font-bold">Error de conexión</p>
            <p className="mt-0.5 text-[#b91c1c]/80">{errorMessage}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function Field({ label, id, value, onChange, placeholder, type = 'text' }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-bold text-[#374151]">{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-border bg-white text-text rounded-[10px] px-3 py-2.5 text-sm outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(37,99,235,0.12)] transition-all placeholder:text-muted/50"
      />
    </div>
  );
}
