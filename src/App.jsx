import { useState, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';
import Header from './components/layout/Header';
import SqlEditor from './components/dashboard/SqlEditor';
import ConnectionPanel from './components/dashboard/ConnectionPanel';
import ResultTabs from './components/dashboard/ResultTabs';
import { analyzeLexicalSyntax, analyzeFull } from './services/api';

function App() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [, setCleared] = useState(false);
  const [selectedDialect, setSelectedDialect] = useState('MYSQL');
  const [connectionStatus, setConnectionStatus] = useState('desconectado');
  const [connectionConfig, setConnectionConfig] = useState(null);

  const handleConnectionChange = useCallback((config) => {
    if (config.connected) {
      setConnectionConfig(config);
      setConnectionStatus('conectado');
    } else {
      setConnectionConfig(null);
      setConnectionStatus('desconectado');
    }
  }, []);

  const handleDialectChange = useCallback((dialect) => {
    setSelectedDialect(dialect);
  }, []);

  const handleAnalyze = useCallback(async (sql, dialect) => {
    if (!sql || !sql.trim()) return;
    setLoading(true);
    setCleared(false);
    try {
      let res;
      if (connectionConfig && connectionConfig.connected) {
        res = await analyzeFull(sql, dialect, {
          dialect: connectionConfig.dialect,
          host: connectionConfig.host,
          port: connectionConfig.port,
          database: connectionConfig.database,
          username: connectionConfig.username,
          password: connectionConfig.password,
        });
      } else {
        res = await analyzeLexicalSyntax(sql, dialect);
      }
      setResponse(res);
    } catch (err) {
      setResponse({
        valid: false,
        executionStatus: 'INTERNAL_ERROR',
        message: err.message,
        lexicalResult: null,
        syntaxResult: null,
        semanticResult: null,
        errors: [{ stage: 'SYSTEM', code: 'REQUEST_ERROR', message: err.message, severity: 'ERROR' }],
        console: [`[ERROR] ${err.message}`],
      });
    } finally {
      setLoading(false);
    }
  }, [connectionConfig]);

  const handleClear = useCallback(() => {
    setResponse(null);
    setCleared(true);
  }, []);

  return (
    <div className="min-h-screen">
      <div className="max-w-[1280px] mx-auto px-6 py-8">
        <Header connectionStatus={connectionStatus} />

        <div className="grid grid-cols-[1.8fr_1fr] gap-[22px] items-start max-lg:grid-cols-1">
          <SqlEditor onAnalyze={handleAnalyze} onClear={handleClear} onDialectChange={handleDialectChange} />
          <ConnectionPanel dialect={selectedDialect} onConnectionChange={handleConnectionChange} />
        </div>

        <div className="mt-[22px]">
          <ResultTabs response={response} loading={loading} />
        </div>

        <div className="mt-[22px] flex justify-end">
          <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-[10px] bg-[#374151] text-white text-sm font-extrabold hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(15,23,42,0.12)] transition-all">
            <ArrowLeft className="w-4 h-4" />
            Regresar
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
