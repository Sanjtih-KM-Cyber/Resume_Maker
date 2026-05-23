/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Step1_Upload } from './components/Step1_Upload';
import { Step2_Interview } from './components/Step2_Interview';
import { Step3_Workspace } from './components/Step3_Workspace';
import { AppStep, ResumeData, InterviewCompany } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Sun, Moon } from 'lucide-react';

export default function App() {
  const [step, setStep] = useState<AppStep>('upload');
  const [extractedData, setExtractedData] = useState<{ resumeText: string; targetRole: string; pictureBase64?: string } | null>(null);
  const [interviewQuestions, setInterviewQuestions] = useState<InterviewCompany[]>([]);
  const [finalResumeData, setFinalResumeData] = useState<ResumeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Step 1 -> 2: Send data to API to get questions
  const handleUploadComplete = async (resumeText: string, targetRole: string, pictureBase64?: string) => {
    try {
      setExtractedData({ resumeText, targetRole, pictureBase64 });
      
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, targetRole })
      });
      
      if (!res.ok) throw new Error('Failed to analyze resume');
      const questions = await res.json();
      
      if (!questions || questions.length === 0) {
        // Skip interview if no questions generated
        setStep('workspace');
        handleInterviewComplete('No work experiences found requiring follow-up.', { resumeText, targetRole, pictureBase64 });
      } else {
        setInterviewQuestions(questions);
        setStep('interview');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during analysis');
    }
  };

  // Step 2 -> 3: Send answers along with original data to generate structured JSON
  const handleInterviewComplete = async (answers: string, overrideData?: { resumeText: string; targetRole: string; pictureBase64?: string }) => {
    try {
      setStep('workspace'); // Show loading state in workspace initially or block here

      const currentData = overrideData || extractedData;

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: currentData?.resumeText,
          targetRole: currentData?.targetRole,
          interviewAnswers: answers
        })
      });

      if (!res.ok) throw new Error('Failed to generate resume');
      const data = await res.json();
      
      // Inject picture if user attached one
      if (currentData?.pictureBase64) {
        data.profileImageBase64 = currentData.pictureBase64;
      }
      
      setFinalResumeData(data as ResumeData);
    } catch (err: any) {
      setError(err.message || 'An error occurred during generation');
      setStep('upload'); // Revert to upload if initial generation fails
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 font-sans tracking-tight transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 py-4 sticky top-0 z-50 transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xl tracking-tighter">
            <Sparkles className="w-6 h-6" />
            Resume<span className="text-slate-800 dark:text-slate-200 font-black">AI</span>
          </div>
          
          <div className="flex items-center gap-8 text-sm font-semibold tracking-wide text-slate-400 dark:text-slate-500 hidden md:flex">
            <div className={`flex items-center gap-2 ${step === 'upload' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-800 dark:text-slate-300'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 'upload' ? 'bg-indigo-600 text-white dark:bg-indigo-500' : 'bg-slate-100 dark:bg-slate-800'}`}>1</div>
              Upload
            </div>
            <div className={`flex items-center gap-2 ${step === 'interview' ? 'text-indigo-600 dark:text-indigo-400' : (step === 'workspace' ? 'text-slate-800 dark:text-slate-300' : '')}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 'interview' ? 'bg-indigo-600 text-white dark:bg-indigo-500' : 'bg-slate-100 dark:bg-slate-800'}`}>2</div>
              AI Context
            </div>
            <div className={`flex items-center gap-2 ${step === 'workspace' ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 'workspace' ? 'bg-indigo-600 text-white dark:bg-indigo-500' : 'bg-slate-100 dark:bg-slate-800'}`}>3</div>
              Workspace
            </div>
          </div>

          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400" aria-label="Toggle Theme">
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 h-[calc(100vh-73px)]">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-lg mb-8 border border-red-200 dark:border-red-800 font-medium flex justify-between items-center">
            <span>Error: {error}</span>
            <button onClick={() => setError(null)} className="underline hover:text-red-800 dark:hover:text-red-200 focus:outline-none">Dismiss</button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 'upload' && (
            <motion.div key="upload" exit={{ opacity: 0, y: -20 }}>
              <Step1_Upload onComplete={handleUploadComplete} />
            </motion.div>
          )}

          {step === 'interview' && (
            <motion.div key="interview" exit={{ opacity: 0, y: -20 }}>
              <Step2_Interview questions={interviewQuestions} onComplete={handleInterviewComplete} />
            </motion.div>
          )}

          {step === 'workspace' && (
            <motion.div key="workspace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full pb-4">
              {!finalResumeData ? (
                <div className="flex flex-col items-center justify-center py-32 text-center h-[60vh]">
                  <div className="w-10 h-10 border-4 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin mb-6" />
                  <h2 className="text-2xl font-bold mb-2 dark:text-slate-100">Compiling ATS-Optimized Document...</h2>
                  <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                    Analyzing missing metrics, injecting powerful action verbs, and structuring for 90%+ ATS match ratios.
                  </p>
                </div>
              ) : (
                <Step3_Workspace initialData={finalResumeData} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
