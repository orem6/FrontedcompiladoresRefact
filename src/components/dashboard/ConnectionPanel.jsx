import { motion } from 'framer-motion';
import { Plug } from 'lucide-react';

export default function ConnectionPanel() {
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
          <Field label="Host" id="host" defaultValue="localhost" />
          <Field label="Puerto" id="port" defaultValue="3306" />
          <div className="col-span-2">
            <Field label="Base de datos" id="database" placeholder="nombre_base_datos" />
          </div>
          <Field label="Usuario" id="user" defaultValue="root" />
          <Field label="Contraseña" id="password" type="password" placeholder="••••••••" />
        </div>

        <div className="flex items-center justify-between gap-3 mt-[18px] flex-wrap">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-[10px] bg-success text-white text-sm font-extrabold hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(15,23,42,0.12)] transition-all">
              <Plug className="w-4 h-4" />
              Conectar
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-[10px] bg-danger text-white text-sm font-extrabold hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(15,23,42,0.12)] transition-all">
              <Plug className="w-4 h-4" />
              Desconectar
            </button>
          </div>
          <span className="inline-flex items-center px-2 py-1 rounded-full bg-[#fee2e2] text-[#991b1b] text-xs font-extrabold border border-transparent">
            Desconectado
          </span>
        </div>

        <p className="text-[13px] text-muted leading-relaxed mt-[18px]">
          El agente debe usar estos datos para construir el objeto de configuración
          de conexión JDBC y enviarlo al analizador semántico.
        </p>
      </div>
    </motion.div>
  );
}

function Field({ label, id, defaultValue, placeholder, type = 'text' }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-bold text-[#374151]">{label}</label>
      <input
        id={id}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full border border-border bg-white text-text rounded-[10px] px-3 py-2.5 text-sm outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(37,99,235,0.12)] transition-all placeholder:text-muted/50"
      />
    </div>
  );
}
