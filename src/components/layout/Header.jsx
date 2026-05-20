import { motion } from 'framer-motion';

export default function Header() {
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
          <p className="text-sm text-muted mt-0.5">Analizador léxico, sintáctico y semántico para motores SQL.</p>
        </div>
      </div>

      <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-border text-sm text-muted shadow-[0_4px_14px_rgba(15,23,42,0.04)]">
        <span className="w-[9px] h-[9px] rounded-full bg-danger" />
        Estado de conexión: <strong className="text-text">Desconectado</strong>
      </div>
    </motion.header>
  );
}
