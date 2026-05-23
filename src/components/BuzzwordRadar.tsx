import React, { useMemo } from 'react';
import { ShieldAlert, ArrowRight } from 'lucide-react';

const BUZZWORDS: Record<string, string[]> = {
  'synergy': ['collaboration', 'integration', 'alignment'],
  'detail-oriented': ['meticulous', 'precise', 'thorough'],
  'think outside the box': ['innovated', 'pioneered', 'conceptualized'],
  'go-getter': ['proactive', 'driven', 'self-starter'],
  'results-driven': ['impact-focused', 'metrics-oriented', 'high-achieving'],
  'team player': ['collaborator', 'cross-functional partner', 'team contributor'],
  'hard worker': ['dedicated', 'persistent', 'committed'],
  'dynamic': ['adaptable', 'versatile', 'agile'],
  'passionate': ['enthusiastic', 'committed', 'dedicated'],
  'ninja': ['expert', 'specialist', 'master'],
  'rockstar': ['top performer', 'expert', 'leader'],
  'responsible for': ['managed', 'directed', 'orchestrated'],
  'helped': ['facilitated', 'supported', 'assisted']
};

interface BuzzwordRadarProps {
  textToScan: string;
}

export const BuzzwordRadar: React.FC<BuzzwordRadarProps> = ({ textToScan }) => {
  const detected = useMemo(() => {
    if (!textToScan) return [];
    const lower = textToScan.toLowerCase();
    const found: { word: string, suggestions: string[] }[] = [];
    Object.entries(BUZZWORDS).forEach(([word, suggestions]) => {
      if (lower.includes(word.toLowerCase())) {
        found.push({ word, suggestions });
      }
    });
    return found;
  }, [textToScan]);

  if (detected.length === 0) return null;

  return (
    <div className="mt-3 p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-900/50 rounded-lg">
      <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-xs uppercase tracking-wider mb-2">
        <ShieldAlert className="w-4 h-4" />
        Buzzword Radar
      </div>
      <div className="space-y-2">
        {detected.map((item, i) => (
          <div key={i} className="text-xs flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 bg-rose-200 dark:bg-rose-800 text-rose-900 dark:text-rose-200 rounded line-through decoration-rose-500 font-medium">
              {item.word}
            </span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
            <div className="flex gap-1.5 flex-wrap">
              {item.suggestions.map((s, j) => (
                <span key={j} className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 rounded font-medium border border-emerald-200 dark:border-emerald-800">
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
