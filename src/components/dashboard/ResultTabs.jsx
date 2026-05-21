import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Hash, Brain, AlertTriangle, Loader } from 'lucide-react';

const tabs = [
  { id: 'console', label: 'Consola', Icon: Terminal },
  { id: 'tokens', label: 'Tokens', Icon: Hash },
  { id: 'semantic', label: 'Semántico', Icon: Brain },
  { id: 'errors', label: 'Errores', Icon: AlertTriangle },
];

export default function ResultTabs({ response, loading }) {
  const [active, setActive] = useState('console');

  useEffect(() => {
    if (response) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActive('console');
    }
  }, [response]);

  const hasResults = response !== null;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, delay: 0.15 }}
      className="rounded-[14px] border border-border bg-[rgba(255,255,255,0.94)] shadow-[0_10px_30px_rgba(15,23,42,0.08)] overflow-hidden"
    >
      <div className="flex gap-2 px-3 pt-2.5 pb-0 border-b border-border bg-[#fbfdff]">
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-t-[10px] text-sm font-extrabold transition-all border border-transparent border-b-none ${
              active === id
                ? 'text-primary bg-white border-border -mb-px'
                : 'text-muted hover:text-text'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      <div className="min-h-[280px]">
        {loading ? (
          <LoadingState />
        ) : !hasResults ? (
          <EmptyState />
        ) : (
          <>
            {active === 'console' && <ConsolePanel lines={response.console} />}
            {active === 'tokens' && <TokensPanel tokens={response.lexicalResult?.tokens} />}
            {active === 'semantic' && <SemanticPanel semantic={response.semanticResult} />}
            {active === 'errors' && <ErrorsPanel response={response} />}
          </>
        )}
      </div>
    </motion.div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-[230px] m-4 border-2 border-dashed border-border rounded-xl flex items-center justify-center text-center p-6 bg-[#fafafa]">
      <div>
        <Loader className="w-8 h-8 text-primary mx-auto mb-2 animate-spin" />
        <p className="text-sm font-bold text-muted">Analizando...</p>
        <p className="text-sm text-muted">Procesando la consulta SQL.</p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="min-h-[230px] m-4 border-2 border-dashed border-border rounded-xl flex items-center justify-center text-center p-6 bg-[#fafafa]">
      <div>
        <AlertTriangle className="w-8 h-8 text-muted mx-auto mb-2" />
        <p className="text-sm font-bold text-muted">Sin datos</p>
        <p className="text-sm text-muted">Presione "Analizar" para ejecutar una consulta.</p>
      </div>
    </div>
  );
}

function ConsolePanel({ lines }) {
  const text = Array.isArray(lines) ? lines.join('\n') : lines || '[INFO] Sin salida de consola.';
  return (
    <div className="p-4">
      <div className="bg-[#111827] text-[#d1d5db] min-h-[230px] rounded-xl p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap">
        {text}
      </div>
    </div>
  );
}

function TokensPanel({ tokens }) {
  if (!tokens || tokens.length === 0) {
    return <NoData message="No se generaron tokens." />;
  }
  return (
    <div className="p-[18px] overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            {['Tipo', 'Lexema', 'Línea', 'Columna', 'Dialecto'].map((h) => (
              <th key={h} className="text-left uppercase text-xs text-[#374151] bg-surface-2 px-2.5 py-[11px] border-b border-border first:rounded-l-none last:rounded-r-none">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tokens.map((t, i) => (
            <tr key={i} className="border-b border-border last:border-0 font-mono">
              <td className="px-2.5 py-[11px] text-text">{t.type}</td>
              <td className="px-2.5 py-[11px] text-text font-bold">{t.lexeme}</td>
              <td className="px-2.5 py-[11px] text-muted">{t.line}</td>
              <td className="px-2.5 py-[11px] text-muted">{t.column}</td>
              <td className="px-2.5 py-[11px] text-muted">{t.dialect || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SemanticPanel({ semantic }) {
  if (!semantic) {
    return <NoData message="No se realizó análisis semántico." />;
  }
  const errors = semantic.errors || [];
  const warnings = semantic.warnings || [];

  return (
    <div className="p-[18px] overflow-x-auto">
      <div className="flex items-center gap-3 mb-4">
        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-extrabold ${semantic.valid ? 'bg-[#dcfce7] text-[#166534]' : 'bg-[#fee2e2] text-[#991b1b]'}`}>
          {semantic.valid ? 'Válido' : 'Inválido'}
        </span>
        <span className="text-sm text-muted">{semantic.message || ''}</span>
      </div>
      {errors.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs uppercase font-bold text-muted mb-2">Errores semánticos</h4>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                {['Código', 'Mensaje', 'Lexema', 'Línea', 'Columna'].map((h) => (
                  <th key={h} className="text-left uppercase text-xs text-[#374151] bg-surface-2 px-2.5 py-[11px] border-b border-border">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {errors.map((e, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="px-2.5 py-[11px] text-danger font-mono">{e.code}</td>
                  <td className="px-2.5 py-[11px] text-text">{e.message}</td>
                  <td className="px-2.5 py-[11px] text-muted font-mono">{e.lexeme || '-'}</td>
                  <td className="px-2.5 py-[11px] text-muted">{e.line || '-'}</td>
                  <td className="px-2.5 py-[11px] text-muted">{e.column || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {warnings.length > 0 && (
        <div>
          <h4 className="text-xs uppercase font-bold text-muted mb-2">Advertencias</h4>
          <ul className="list-disc list-inside text-sm text-warning">
            {warnings.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

function ErrorsPanel({ response }) {
  const allErrors = [];

  if (response.lexicalResult?.errors?.length) {
    allErrors.push(...response.lexicalResult.errors.map(e => ({ ...e, stage: 'LÉXICO' })));
  }
  if (response.syntaxResult?.errors?.length) {
    allErrors.push(...response.syntaxResult.errors.map(e => ({ ...e, stage: 'SINTÁCTICO' })));
  }
  if (response.semanticResult?.errors?.length) {
    allErrors.push(...response.semanticResult.errors.map(e => ({ ...e, stage: 'SEMÁNTICO' })));
  }

  if (allErrors.length === 0) {
    return (
      <div className="min-h-[230px] m-4 border-2 border-dashed border-border rounded-xl flex items-center justify-center text-center p-6 bg-[#fafafa]">
        <div>
          <AlertTriangle className="w-8 h-8 text-muted mx-auto mb-2" />
          <p className="text-sm font-bold text-muted mb-0.5">Sin errores detectados</p>
          <p className="text-sm text-muted">La consulta no presenta errores léxicos, sintácticos ni semánticos.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-[18px] overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            {['Fase', 'Código', 'Mensaje', 'Lexema', 'Línea', 'Columna', 'Severidad'].map((h) => (
              <th key={h} className="text-left uppercase text-xs text-[#374151] bg-surface-2 px-2.5 py-[11px] border-b border-border">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allErrors.map((e, i) => (
            <tr key={i} className="border-b border-border last:border-0">
              <td className="px-2.5 py-[11px]">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-extrabold ${
                  e.stage === 'LÉXICO' ? 'bg-[#fef3c7] text-[#92400e]' :
                  e.stage === 'SINTÁCTICO' ? 'bg-[#fee2e2] text-[#991b1b]' :
                  'bg-[#ffedd5] text-[#9a3412]'
                }`}>
                  {e.stage}
                </span>
              </td>
              <td className="px-2.5 py-[11px] text-text font-mono">{e.code}</td>
              <td className="px-2.5 py-[11px] text-text">{e.message}</td>
              <td className="px-2.5 py-[11px] text-muted font-mono">{e.lexeme || '-'}</td>
              <td className="px-2.5 py-[11px] text-muted">{e.line || '-'}</td>
              <td className="px-2.5 py-[11px] text-muted">{e.column || '-'}</td>
              <td className="px-2.5 py-[11px]">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-extrabold ${
                  e.severity === 'ERROR' ? 'text-[#991b1b] bg-[#fee2e2]' :
                  e.severity === 'WARNING' ? 'text-[#92400e] bg-[#fef3c7]' :
                  'text-muted bg-surface-2'
                }`}>
                  {e.severity || 'ERROR'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function NoData({ message }) {
  return (
    <div className="min-h-[230px] m-4 border-2 border-dashed border-border rounded-xl flex items-center justify-center text-center p-6 bg-[#fafafa]">
      <div>
        <AlertTriangle className="w-8 h-8 text-muted mx-auto mb-2" />
        <p className="text-sm font-bold text-muted">{message}</p>
      </div>
    </div>
  );
}
