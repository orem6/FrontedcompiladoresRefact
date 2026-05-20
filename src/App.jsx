import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Header from './components/layout/Header';
import SqlEditor from './components/dashboard/SqlEditor';
import ConnectionPanel from './components/dashboard/ConnectionPanel';
import ResultTabs from './components/dashboard/ResultTabs';

function App() {
  const [cleared, setCleared] = useState(false);

  return (
    <div className="min-h-screen">
      <div className="max-w-[1280px] mx-auto px-6 py-8">
        <Header />

        <div className="grid grid-cols-[1.8fr_1fr] gap-[22px] items-start max-lg:grid-cols-1">
          <SqlEditor onAnalyze={() => setCleared(false)} onClear={() => setCleared(true)} />
          <ConnectionPanel />
        </div>

        <div className="mt-[22px]">
          <ResultTabs cleared={cleared} />
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
