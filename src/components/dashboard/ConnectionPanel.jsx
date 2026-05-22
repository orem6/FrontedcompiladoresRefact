import React from 'react'; // eslint-disable-line no-unused-vars
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plug, PlugZap } from 'lucide-react';
import { validateConnection } from '../../services/api';
import { DIALECTS } from '../../data/mockData';

function getDialectConfig(dialect) {
  return DIALECTS.find((item) => item.value === dialect);
}

export default function ConnectionPanel({ dialect, onConnectionChange }) {
  const dialectConfig = getDialectConfig(dialect);
  const isCassandra = dialect === 'CASSANDRA_CQL';
  const isMongo = dialect === 'MONGODB';

  const [host, setHost] = useState('localhost');
  const [port, setPort] = useState(dialectConfig?.defaultPort || '3306');
  const [database, setDatabase] = useState('');
  const [schema, setSchema] = useState('');
  const [username, setUsername] = useState(dialectConfig?.defaultUser || '');
  const [password, setPassword] = useState('');
  const [localDatacenter, setLocalDatacenter] = useState('datacenter1');
  const [useDirectJdbcUrl, setUseDirectJdbcUrl] = useState(false);
  const [jdbcUrl, setJdbcUrl] = useState('');
  const [status, setStatus] = useState('desconectado');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const getConfig = () => ({
    dialect,
    host,
    port: Number(port),
    database,
    schema: schema || null,
    username: username || '',
    password,
    jdbcUrl: jdbcUrl || null,
    useDirectJdbcUrl,
    localDatacenter: isCassandra ? localDatacenter : null,
  });

  const validateForm = () => {
    if (!dialect) return 'Debe seleccionar un dialecto.';
    if (!useDirectJdbcUrl && !host.trim()) return 'Host es requerido.';
    if (!useDirectJdbcUrl && (!port.trim() || Number.isNaN(Number(port)))) return 'Puerto es requerido y numerico.';
    if (!database.trim()) return isCassandra ? 'Keyspace es requerido.' : 'Base de datos es requerida.';
    if (isCassandra && !localDatacenter.trim()) return 'Local Datacenter es requerido para Cassandra CQL.';
    if (useDirectJdbcUrl && !jdbcUrl.trim()) return 'La URI directa es requerida cuando esta opcion esta habilitada.';
    return null;
  };

  const handleConnect = async () => {
    const validationError = validateForm();
    if (validationError) {
      setStatus('error');
      setErrorMessage(validationError);
      if (onConnectionChange) onConnectionChange({ connected: false, status: 'error' });
      return;
    }

    setLoading(true);
    setStatus('conectando');
    if (onConnectionChange) onConnectionChange({ connected: false, status: 'conectando' });
    setErrorMessage('');
    try {
      const config = getConfig();
      const res = await validateConnection(config);
      if (res.valid) {
        setStatus('conectado');
        setErrorMessage('');
        if (onConnectionChange) {
          onConnectionChange({ ...config, connected: true, status: 'conectado', connectionResult: res.connectionResult || null });
        }
      } else {
        setStatus('error');
        setErrorMessage(res.message || 'Error de conexion a la base de datos.');
        if (onConnectionChange) onConnectionChange({ connected: false, status: 'error' });
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message || 'Error de conexion a la base de datos.');
      if (onConnectionChange) onConnectionChange({ connected: false, status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    setStatus('desconectado');
    setErrorMessage('');
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
            <Field
              label={isCassandra ? 'Keyspace' : dialect === 'MONGODB' ? 'Database' : 'Base de datos'}
              id="database"
              value={database}
              onChange={setDatabase}
              placeholder={isCassandra ? 'demo' : 'nombre_base_datos'}
            />
          </div>
          <Field label="Usuario" id="user" value={username} onChange={setUsername} placeholder={dialectConfig?.defaultUser || 'usuario'} />
          <Field label="Contraseña" id="password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
          {(dialect === 'POSTGRESQL' || dialect === 'SQL_SERVER') && (
            <Field
              label="Schema (opcional)"
              id="schema"
              value={schema}
              onChange={setSchema}
              placeholder={dialect === 'POSTGRESQL' ? 'public' : 'dbo'}
            />
          )}
          {isCassandra && (
            <Field label="Local Datacenter" id="localDatacenter" value={localDatacenter} onChange={setLocalDatacenter} placeholder="datacenter1" />
          )}
          {isMongo && (
            <div className="col-span-2 rounded-[10px] border border-border p-3 bg-[#fbfdff]">
              <label className="flex items-center gap-2 text-sm font-bold text-[#374151]">
                <input type="checkbox" checked={useDirectJdbcUrl} onChange={(e) => setUseDirectJdbcUrl(e.target.checked)} />
                Usar URI directa MongoDB
              </label>
              {useDirectJdbcUrl && (
                <div className="mt-3">
                  <Field label="URI directa MongoDB" id="jdbcUrl" value={jdbcUrl} onChange={setJdbcUrl} placeholder="mongodb://user:pass@localhost:27017/orders_db" />
                </div>
              )}
            </div>
          )}
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
