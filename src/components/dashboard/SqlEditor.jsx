import React from 'react'; // eslint-disable-line no-unused-vars
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, HelpCircle, X } from 'lucide-react';
import { DIALECTS, defaultSql, defaultCql, defaultMongo, defaultMongoPipeline } from '../../data/mockData';

const DEFAULTS = { MYSQL: defaultSql, POSTGRESQL: defaultSql, SQL_SERVER: defaultSql, CASSANDRA_CQL: defaultCql, MONGODB: defaultMongo };

export default function SqlEditor({ onAnalyze, onClear, onDialectChange, targetCollection, onTargetCollectionChange }) {
  const [sql, setSql] = useState(defaultSql);
  const [dialect, setDialect] = useState('MYSQL');
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSql(DEFAULTS[dialect] || defaultSql);
  }, [dialect]);

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
    if (onAnalyze) onAnalyze(sql, dialect, targetCollection || '');
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleAnalyze();
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, delay: 0.05 }}
      className="rounded-[14px] border border-border bg-[rgba(255,255,255,0.94)] shadow-[0_10px_30px_rgba(15,23,42,0.08)] overflow-hidden"
    >
      <div className="flex items-center justify-between gap-4 px-5 py-[18px] border-b border-border bg-[#fbfdff]">
        <h2 className="text-base font-bold text-text uppercase tracking-[0.4px]">Instruccion</h2>
        <div className="flex flex-col gap-1.5 min-w-[210px]">
          <label htmlFor="dialect" className="text-[13px] font-bold text-[#374151]">Motor de base de datos</label>
          <select
            id="dialect"
            value={dialect}
            onChange={handleDialectChange}
            className="w-full border border-border bg-white text-text rounded-[10px] px-3 py-2.5 text-sm outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(37,99,235,0.12)] transition-all"
          >
            {DIALECTS.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-5">
        <textarea
          className="w-full min-h-[220px] resize-y rounded-[10px] border border-editor-border bg-editor-bg text-editor-text font-mono text-sm leading-relaxed p-3 outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(37,99,235,0.12)] transition-all"
          spellCheck="false"
          value={sql}
          onChange={(e) => setSql(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {dialect === 'MONGODB' && (
          <div className="mt-3">
            <label htmlFor="targetCollection" className="text-[13px] font-bold text-[#374151]">Coleccion objetivo</label>
            <input
              id="targetCollection"
              type="text"
              value={targetCollection || ''}
              onChange={(e) => onTargetCollectionChange?.(e.target.value)}
              placeholder="orders"
              className="mt-1 w-full border border-border bg-white text-text rounded-[10px] px-3 py-2.5 text-sm outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(37,99,235,0.12)] transition-all"
            />
            <p className="text-xs text-muted mt-1">Necesario para analisis semantico cuando se usa un pipeline MongoDB puro sin db.collection.aggregate(...).</p>
          </div>
        )}

        <div className="flex items-center justify-between flex-wrap gap-2.5 mt-3.5">
          <div className="flex flex-wrap gap-2.5">
            <button onClick={handleAnalyze} className="flex items-center gap-1.5 px-4 py-2.5 rounded-[10px] bg-primary text-white text-sm font-extrabold hover:bg-primary-dark hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(15,23,42,0.12)] transition-all">
              <Play className="w-4 h-4" />
              Analizar
            </button>
            <button onClick={handleClear} className="flex items-center gap-1.5 px-4 py-2.5 rounded-[10px] bg-[#e5e7eb] text-[#111827] text-sm font-extrabold hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(15,23,42,0.12)] transition-all">
              <RotateCcw className="w-4 h-4" />
              Limpiar
            </button>
            <button onClick={() => setShowHelp(true)} className="flex items-center gap-1.5 px-4 py-2.5 rounded-[10px] bg-help text-white text-sm font-extrabold hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(15,23,42,0.12)] transition-all">
              <HelpCircle className="w-4 h-4" />
              Ayuda
            </button>
          </div>
          <span className="text-xs text-muted/60 font-mono">Ctrl+Enter</span>
        </div>

      </div>

      <AnimatePresence>
        {showHelp && (
          <HelpModal onClose={() => setShowHelp(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const examples = [
  {
    title: 'SQL',
    examples: [
      { label: 'SELECT', sql: 'SELECT c.id, c.nombre\nFROM clientes c\nWHERE c.estado = 1\nORDER BY c.nombre ASC;' },
      { label: 'INSERT', sql: 'INSERT INTO usuarios (nombre, email)\nVALUES (\'Juan\', \'juan@email.com\');' },
      { label: 'UPDATE', sql: 'UPDATE productos\nSET precio = 99.99\nWHERE id = 1;' },
      { label: 'DELETE', sql: 'DELETE FROM pedidos\nWHERE estado = \'cancelado\';' },
      { label: 'CREATE TABLE', sql: 'CREATE TABLE empleados (\n  id INT PRIMARY KEY,\n  nombre VARCHAR(100),\n  salario DECIMAL(10,2)\n);' },
      { label: 'JOIN', sql: 'SELECT o.id, c.nombre\nFROM ordenes o\nINNER JOIN clientes c ON c.id = o.cliente_id\nLEFT JOIN pagos p ON p.orden_id = o.id;' },
    ],
  },
  {
    title: 'Cassandra CQL',
    examples: [
      { label: 'SELECT', sql: 'SELECT id, nombre, email\nFROM usuarios\nWHERE edad > 18\nALLOW FILTERING;' },
      { label: 'INSERT (TTL)', sql: 'INSERT INTO usuarios (id, nombre, email)\nVALUES (uuid(), \'Juan\', \'juan@email.com\')\nUSING TTL 86400;' },
      { label: 'CREATE TABLE', sql: 'CREATE TABLE usuarios (\n  id UUID PRIMARY KEY,\n  nombre TEXT,\n  email TEXT\n) WITH CLUSTERING ORDER BY (nombre ASC);' },
    ],
  },
  {
    title: 'MongoDB instruccion completa',
    examples: [
      { label: 'find', sql: 'db.orders.find({ status: "active" })' },
      { label: 'aggregate', sql: 'db.orders.aggregate([\n  { "$match": { "status": "active" } },\n  { "$group": { "_id": "$category", "total": { "$sum": 1 } } }\n])' },
    ],
  },
  {
    title: 'MongoDB pipeline puro',
    examples: [
      { label: '$match + $group', sql: defaultMongoPipeline },
      { label: '$match + $sort + $limit', sql: '[\n  { "$match": { "precio": { "$gte": 100 } } },\n  { "$sort": { "fecha": -1 } },\n  { "$limit": 10 }\n]' },
      { label: '$lookup (join)', sql: '[\n  { "$match": { "cliente_id": "123" } },\n  {\n    "$lookup": {\n      "from": "pedidos",\n      "localField": "_id",\n      "foreignField": "cliente_id",\n      "as": "pedidos"\n    }\n  }\n]' },
    ],
  },
];

function HelpModal({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-[16px] shadow-[0_20px_60px_rgba(15,23,42,0.15)] max-w-2xl w-full max-h-[80vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-bold text-text">Ayuda - Ejemplos</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-2 transition-colors">
            <X className="w-5 h-5 text-muted" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          {examples.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-bold text-muted uppercase tracking-wide mb-3">{section.title}</h3>
              <div className="space-y-3">
                {section.examples.map((ex) => (
                  <div key={ex.label} className="rounded-[10px] border border-border overflow-hidden">
                    <div className="px-4 py-2 bg-surface-2 text-xs font-bold text-muted uppercase tracking-wide">{ex.label}</div>
                    <pre className="px-4 py-3 bg-editor-bg text-editor-text font-mono text-sm leading-relaxed overflow-x-auto whitespace-pre-wrap">{ex.sql}</pre>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
