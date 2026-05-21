import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, HelpCircle } from 'lucide-react';
import { dialects, defaultSql } from '../../data/mockData';

export default function SqlEditor({ onAnalyze, onClear, onDialectChange }) {
  const [sql, setSql] = useState(defaultSql);
  const [dialect, setDialect] = useState('MYSQL');

  const handleDialectChange = (e) => {
    const val = e.target.value;
    setDialect(val);
    if (onDialectChange) onDialectChange(val);
  };

  const handleClear = () => {
    setSql('');
    onClear();
  };

  const handleAnalyze = () => {
    if (onAnalyze) onAnalyze(sql, dialect);
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, delay: 0.05 }}
      className="rounded-[14px] border border-border bg-[rgba(255,255,255,0.94)] shadow-[0_10px_30px_rgba(15,23,42,0.08)] overflow-hidden"
    >
      <div className="flex items-center justify-between gap-4 px-5 py-[18px] border-b border-border bg-[#fbfdff]">
        <h2 className="text-base font-bold text-text uppercase tracking-[0.4px]">Consulta SQL</h2>
        <div className="flex flex-col gap-1.5 min-w-[210px]">
          <label htmlFor="dialect" className="text-[13px] font-bold text-[#374151]">Motor de base de datos</label>
          <select
            id="dialect"
            value={dialect}
            onChange={handleDialectChange}
            className="w-full border border-border bg-white text-text rounded-[10px] px-3 py-2.5 text-sm outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(37,99,235,0.12)] transition-all"
          >
            {dialects.map((d) => {
              const val = d === 'SQL Server' ? 'SQL_SERVER' : d.toUpperCase();
              return <option key={d} value={val}>{d}</option>;
            })}
          </select>
        </div>
      </div>

      <div className="p-5">
        <textarea
          className="w-full min-h-[220px] resize-y rounded-[10px] border border-editor-border bg-editor-bg text-editor-text font-mono text-sm leading-relaxed p-3 outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(37,99,235,0.12)] transition-all"
          spellCheck="false"
          value={sql}
          onChange={(e) => setSql(e.target.value)}
        />

        <div className="flex flex-wrap gap-2.5 mt-3.5">
          <button onClick={handleAnalyze} className="flex items-center gap-1.5 px-4 py-2.5 rounded-[10px] bg-primary text-white text-sm font-extrabold hover:bg-primary-dark hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(15,23,42,0.12)] transition-all">
            <Play className="w-4 h-4" />
            Analizar
          </button>
          <button onClick={handleClear} className="flex items-center gap-1.5 px-4 py-2.5 rounded-[10px] bg-[#e5e7eb] text-[#111827] text-sm font-extrabold hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(15,23,42,0.12)] transition-all">
            <RotateCcw className="w-4 h-4" />
            Limpiar
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-[10px] bg-help text-white text-sm font-extrabold hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(15,23,42,0.12)] transition-all">
            <HelpCircle className="w-4 h-4" />
            Ayuda
          </button>
        </div>
      </div>
    </motion.div>
  );
}
