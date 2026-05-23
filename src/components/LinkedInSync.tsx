import React, { useState } from 'react';
import { Linkedin, Loader2, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { ResumeData } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface LinkedInSyncProps {
  data: ResumeData;
}

export const LinkedInSync: React.FC<LinkedInSyncProps> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{ headline?: string, about?: string } | null>(null);
  const [copiedHeadline, setCopiedHeadline] = useState(false);
  const [copiedAbout, setCopiedAbout] = useState(false);

  const handleSync = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          summary: data.professionalSummary, 
          title: data.contactInfo.targetTitle 
        })
      });
      if (res.ok) {
        const json = await res.json();
        setResults(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: 'headline' | 'about') => {
    navigator.clipboard.writeText(text);
    if (type === 'headline') {
      setCopiedHeadline(true);
      setTimeout(() => setCopiedHeadline(false), 2000);
    } else {
      setCopiedAbout(true);
      setTimeout(() => setCopiedAbout(false), 2000);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-blue-200 dark:border-blue-900/50 shadow-sm overflow-hidden mt-8 mb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
      >
        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold">
          <Linkedin className="w-5 h-5" />
          LinkedIn Sync
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-blue-500" /> : <ChevronDown className="w-5 h-5 text-blue-500" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0 }} 
            animate={{ height: 'auto' }} 
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-5 border-t border-blue-100 dark:border-blue-800/50 space-y-4">
              {!results && !isLoading && (
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  <p className="mb-4">Generate a high-impact LinkedIn Headline and About section based on your current resume summary and target title.</p>
                  <button 
                    onClick={handleSync}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors"
                  >
                    Generate LinkedIn Content
                  </button>
                </div>
              )}

              {isLoading && (
                <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 text-sm font-medium py-4">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Optimizing for LinkedIn...
                </div>
              )}

              {results && !isLoading && (
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Professional Headline</h4>
                      <button 
                        onClick={() => copyToClipboard(results.headline || '', 'headline')}
                        className="flex items-center gap-1 text-[10px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded transition-colors"
                      >
                        {copiedHeadline ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        {copiedHeadline ? 'Copied' : 'Click to Copy'}
                      </button>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-200">
                      {results.headline}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">About / Bio Section</h4>
                      <button 
                        onClick={() => copyToClipboard(results.about || '', 'about')}
                        className="flex items-center gap-1 text-[10px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded transition-colors"
                      >
                        {copiedAbout ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        {copiedAbout ? 'Copied' : 'Click to Copy'}
                      </button>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                      {results.about}
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button onClick={handleSync} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                      Regenerate
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
