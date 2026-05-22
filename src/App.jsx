import { useState, useCallback } from 'react';
import Header from './components/layout/Header';
import SqlEditor from './components/dashboard/SqlEditor';
import ConnectionPanel from './components/dashboard/ConnectionPanel';
import ResultTabs from './components/dashboard/ResultTabs';
import { analyzeLexicalSyntax, analyzeFull } from './services/api';

function normalizeBackendError(body, fallbackMessage) {
  const message = body?.message || fallbackMessage || 'Error inesperado';
  return {
    valid: false,
    executionStatus: body?.executionStatus || 'INVALID_REQUEST',
    message,
    lexicalResult: body?.lexicalResult || null,
    syntaxResult: body?.syntaxResult || null,
    semanticResult: body?.semanticResult || null,
    errors: body?.errors || [{ stage: 'SYSTEM', code: 'REQUEST_ERROR', message, severity: 'ERROR' }],
    console: body?.console || [`[ERROR] ${message}`],
  };
}

function App() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedDialect, setSelectedDialect] = useState('MYSQL');
  const [targetCollection, setTargetCollection] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('desconectado');
  const [connectionConfig, setConnectionConfig] = useState(null);
  const [connectionResult, setConnectionResult] = useState(null);
  const [globalError, setGlobalError] = useState('');

  const handleConnectionChange = useCallback((config) => {
    if (config?.status) {
      setConnectionStatus(config.status);
    }
    if (config.connected) {
      setConnectionConfig(config);
      setConnectionStatus('conectado');
      setConnectionResult(config.connectionResult || null);
      setGlobalError('');
    } else {
      setConnectionConfig(null);
      setConnectionStatus('desconectado');
      setConnectionResult(null);
    }
  }, []);

  const handleDialectChange = useCallback((dialect) => {
    if (connectionConfig?.connected && connectionConfig.dialect !== dialect) {
      setConnectionConfig(null);
      setConnectionResult(null);
      setConnectionStatus('desconectado');
      setGlobalError('Se cambio el motor de base de datos. La conexion anterior fue descartada.');
    }
    setSelectedDialect(dialect);
  }, [connectionConfig]);

  const isMongoPipeline = useCallback((sql, dialect) => {
    return dialect === 'MONGODB' && sql.trim().startsWith('[');
  }, []);

  const handleAnalyze = useCallback(async (sql, dialect, editorTargetCollection = '') => {
    if (!sql || !sql.trim()) return;
    setGlobalError('');

    const canRunFull = connectionConfig?.connected && connectionConfig.dialect === dialect;
    const pipelineMode = isMongoPipeline(sql, dialect);
    if (canRunFull && pipelineMode && !editorTargetCollection.trim()) {
      setGlobalError('Para analisis semantico de un pipeline MongoDB puro debe ingresar la coleccion objetivo.');
      return;
    }

    setLoading(true);
    try {
      let res;
      if (canRunFull) {
        res = await analyzeFull({
          sql,
          dialect,
          connectionConfig: {
            dialect: connectionConfig.dialect,
            host: connectionConfig.host,
            port: connectionConfig.port,
            database: connectionConfig.database,
            schema: connectionConfig.schema || null,
            username: connectionConfig.username || '',
            password: connectionConfig.password || '',
            jdbcUrl: connectionConfig.jdbcUrl || null,
            useDirectJdbcUrl: Boolean(connectionConfig.useDirectJdbcUrl),
            localDatacenter: connectionConfig.localDatacenter || null,
          },
          targetCollection: dialect === 'MONGODB' ? (editorTargetCollection || null) : null,
        });
      } else {
        res = await analyzeLexicalSyntax({
          sql,
          dialect,
          mode: 'LEXICAL_SYNTAX',
          targetCollection: dialect === 'MONGODB' ? (editorTargetCollection || null) : null,
        });
      }
      setResponse(res);
    } catch (err) {
      if (err.body) {
        setResponse(normalizeBackendError(err.body, err.message));
      } else {
        setResponse(normalizeBackendError(null, err.message));
      }
    } finally {
      setLoading(false);
    }
  }, [connectionConfig, isMongoPipeline]);

  const handleClear = useCallback(() => {
    setResponse(null);
  }, []);

  return (
    <div className="min-h-screen">
      <div className="max-w-[1280px] mx-auto px-6 py-8">
        <Header connectionStatus={connectionStatus} connectedDialect={connectionConfig?.dialect} />

        {globalError && (
          <div className="mb-4 p-3 rounded-[10px] bg-[#fee2e2] border border-[#fecaca] text-sm text-[#991b1b]">
            {globalError}
          </div>
        )}

        {connectionResult?.message && connectionStatus === 'conectado' && (
          <div className="mb-4 p-3 rounded-[10px] bg-[#ecfeff] border border-[#a5f3fc] text-sm text-[#155e75]">
            {connectionResult.message}
          </div>
        )}

        <div className="grid grid-cols-[1.8fr_1fr] gap-[22px] items-start max-lg:grid-cols-1">
          <SqlEditor
            onAnalyze={handleAnalyze}
            onClear={handleClear}
            onDialectChange={handleDialectChange}
            targetCollection={targetCollection}
            onTargetCollectionChange={setTargetCollection}
          />
          <ConnectionPanel key={selectedDialect} dialect={selectedDialect} onConnectionChange={handleConnectionChange} />
        </div>

        <div className="mt-[22px]">
          <ResultTabs response={response} loading={loading} />
        </div>
      </div>
    </div>
  );
}

export default App;
