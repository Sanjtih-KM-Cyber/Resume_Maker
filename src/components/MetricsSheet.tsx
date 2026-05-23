import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lightbulb, Copy, Loader2, RefreshCw } from 'lucide-react';

interface MetricsSheetProps {
  targetRole: string;
  onInject: (metric: string) => void;
}

export const MetricsSheet: React.FC<MetricsSheetProps> = ({ targetRole, onInject }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [metrics, setMetrics] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMetrics = async () => {
    if (!targetRole) return;
    setIsLoading(true);
    setIsOpen(true);
    try {
      const res = await fetch('/api/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetRole })
      });
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="mt-2">
      <button 
        onClick={() => isOpen ? setIsOpen(false) : fetchMetrics()}
        className="flex items-center gap-1.5 text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
      >
        <Lightbulb className="w-3 h-3" />
        {isOpen ? 'Close Cheat Sheet' : 'Stuck on Metrics? View Examples'}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-2 p-3 bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-lg">
              {isLoading ? (
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs py-2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Generating X-Y-Z metrics for "{targetRole}"...
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Target: {targetRole}</span>
                    <button onClick={fetchMetrics} className="text-indigo-500 hover:text-indigo-700 p-1" title="Regenerate">
                      <RefreshCw className="w-3 h-3" />
                    </button>
                  </div>
                  {metrics.map((m, idx) => (
                    <div key={idx} className="group relative flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 p-2 rounded border border-slate-100 dark:border-slate-700 hover:border-indigo-300 transition-colors">
                      <div className="flex-1 leading-relaxed">{m}</div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1 shrink-0">
                        <button onClick={() => copyToClipboard(m)} className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-50 dark:bg-slate-700 rounded" title="Copy">
                          <Copy className="w-3 h-3" />
                        </button>
                        <button onClick={() => onInject(m)} className="text-[10px] bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 font-medium px-1.5 py-0.5 rounded" title="Inject into active field">
                          Inject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
