import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Bot, Building2 } from 'lucide-react';
import { InterviewCompany } from '../types';

interface Step2Props {
  questions: InterviewCompany[];
  onComplete: (answers: string) => void;
}

export const Step2_Interview: React.FC<Step2Props> = ({ questions, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answersMap, setAnswersMap] = useState<Record<string, string[]>>({});
  const [currentCompanyAnswers, setCurrentCompanyAnswers] = useState<string[]>([]);

  // Initialize the answers array when step changes, if not already set
  React.useEffect(() => {
    if (questions && questions.length > 0 && currentStep < questions.length) {
      const company = questions[currentStep].companyName;
      setCurrentCompanyAnswers(answersMap[company] || Array(questions[currentStep].questions.length).fill(''));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, questions]);

  const handleAnswerChange = (index: number, text: string) => {
    const newAnswers = [...currentCompanyAnswers];
    newAnswers[index] = text;
    setCurrentCompanyAnswers(newAnswers);
  };

  const handleNext = () => {
    if (!questions || questions.length === 0) return;
    
    // Check if at least one question is answered in this step (or maybe all?)
    if (currentCompanyAnswers.every(a => !a.trim())) return;

    const currentCompany = questions[currentStep].companyName;
    const updatedMap = {
      ...answersMap,
      [currentCompany]: currentCompanyAnswers
    };
    
    setAnswersMap(updatedMap);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Completed all questions, compile string
      let compiledString = '';
      questions.forEach(comp => {
        const answers = updatedMap[comp.companyName] || [];
        compiledString += `=== Company: ${comp.companyName} | Role: ${comp.roleTitle} ===\n`;
        comp.questions.forEach((q, idx) => {
          compiledString += `Q: ${q}\nA: ${answers[idx] || 'N/A'}\n\n`;
        });
      });
      onComplete(compiledString);
    }
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-600 dark:text-slate-300 font-medium">Generating intelligent follow-up questions for your work experiences...</p>
      </div>
    );
  }

  const currentCompany = questions[currentStep];
  const progress = ((currentStep) / questions.length) * 100;

  // Let's require all questions to be answered for the current company
  const isValid = currentCompanyAnswers.length === currentCompany.questions.length && currentCompanyAnswers.every(a => a.trim().length > 0);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-3xl mx-auto mt-4"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col min-h-[500px]">
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800">
          <motion.div 
            className="h-full bg-indigo-600 dark:bg-indigo-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="p-6 md:p-8 flex-1 flex flex-col">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                Step {currentStep + 1} of {questions.length}: Optimizing your time at {currentCompany.companyName}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Role: {currentCompany.roleTitle} {currentCompany.tenureYears ? `• Tenure: ${currentCompany.tenureYears} yrs` : ''}</p>
            </div>
          </div>

          <div className="space-y-8 flex-1 overflow-y-auto pr-2 custom-scrollbar-hide">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {currentCompany.questions.map((q, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200/60 dark:border-slate-700/50 shadow-sm relative">
                    <div className="absolute -top-3 left-4 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest shadow-sm">
                      Question {idx + 1}
                    </div>
                    <p className="text-[15px] text-slate-800 dark:text-slate-200 font-medium leading-relaxed mt-2 mb-4">
                      {q}
                    </p>
                    <textarea
                      value={currentCompanyAnswers[idx] || ''}
                      onChange={(e) => handleAnswerChange(idx, e.target.value)}
                      placeholder="Type your answer here..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all h-28 resize-none shadow-sm text-sm"
                    />
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
          
          <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800">
            <button
               // Enable if valid, but also if there's no question array somehow
              disabled={!isValid && currentCompany.questions.length > 0}
              onClick={handleNext}
              className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-semibold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
            >
              {currentStep === questions.length - 1 ? 'Compile Optimized Resume' : 'Next Company'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
