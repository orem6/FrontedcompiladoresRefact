import { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Hash, Brain, AlertTriangle } from 'lucide-react';
import { tokenResults, semanticResults, consoleDefault } from '../../data/mockData';

const tabs = [
  { id: 'console', label: 'Consola', Icon: Terminal },
  { id: 'tokens', label: 'Tokens', Icon: Hash },
  { id: 'semantic', label: 'Semántico', Icon: Brain },
  { id: 'errors', label: 'Errores', Icon: AlertTriangle },
];

export default function ResultTabs({ cleared }) {
  const [active, setActive] = useState('console');

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
        {active === 'console' && (cleared ? <EmptyConsole /> : <ConsolePanel />)}
        {active === 'tokens' && (cleared ? <EmptyTable /> : <TokensPanel />)}
        {active === 'semantic' && (cleared ? <EmptyTable /> : <SemanticPanel />)}
        {active === 'errors' && <ErrorsPanel />}
      </div>
    </motion.div>
  );
}

function ConsolePanel() {
  return (
    <div className="p-4">
      <div className="bg-[#111827] text-[#d1d5db] min-h-[230px] rounded-xl p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap">
        {consoleDefault}
      </div>
    </div>
  );
}

function TokensPanel() {
  return (
    <div className="p-[18px] overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            {['Tipo', 'Lexema', 'Línea', 'Columna', 'Motor'].map((h) => (
              <th key={h} className="text-left uppercase text-xs text-[#374151] bg-surface-2 px-2.5 py-[11px] border-b border-border first:rounded-l-none last:rounded-r-none">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tokenResults.map((t, i) => (
            <tr key={i} className="border-b border-border last:border-0">
              <td className="px-2.5 py-[11px] text-text">{t.tipo}</td>
              <td className="px-2.5 py-[11px] text-text font-mono">{t.lexema}</td>
              <td className="px-2.5 py-[11px] text-muted">{t.linea}</td>
              <td className="px-2.5 py-[11px] text-muted">{t.columna}</td>
              <td className="px-2.5 py-[11px] text-muted">{t.motor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SemanticPanel() {
  return (
    <div className="p-[18px] overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            {['Validación', 'Objeto', 'Resultado', 'Detalle'].map((h) => (
              <th key={h} className="text-left uppercase text-xs text-[#374151] bg-surface-2 px-2.5 py-[11px] border-b border-border">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {semanticResults.map((s, i) => (
            <tr key={i} className="border-b border-border last:border-0">
              <td className="px-2.5 py-[11px] text-text">{s.validacion}</td>
              <td className="px-2.5 py-[11px] text-text font-mono">{s.objeto}</td>
              <td className="px-2.5 py-[11px]">
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-[#dcfce7] text-[#166534] text-xs font-extrabold">
                  {s.resultado}
                </span>
              </td>
              <td className="px-2.5 py-[11px] text-muted">{s.detalle}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmptyConsole() {
  return (
    <div className="p-4">
      <div className="bg-[#111827] text-[#d1d5db] min-h-[230px] rounded-xl p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap">
        [INFO] Consola limpiada.
      </div>
    </div>
  );
}

function EmptyTable() {
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

function ErrorsPanel() {
  return (
    <div className="min-h-[230px] m-4 border-2 border-dashed border-border rounded-xl flex items-center justify-center text-center p-6 bg-[#fafafa]">
      <div>
        <AlertTriangle className="w-8 h-8 text-muted mx-auto mb-2" />
        <p className="text-sm font-bold text-muted mb-0.5">Sin errores detectados</p>
        <p className="text-sm text-muted">Los errores léxicos, sintácticos o semánticos deberán listarse aquí.</p>
      </div>
    </div>
  );
}
