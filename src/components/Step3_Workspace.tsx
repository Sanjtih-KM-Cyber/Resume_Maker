import React, { useState, useEffect, useRef } from 'react';
import { ResumeData, TemplateId } from '../types';
import { TemplatePicker } from './TemplatePicker';
import { ResumeDocument } from '../utils/pdfTemplates';
import { Download, Check, X, Sparkles, Send, Loader2, Undo2, Redo2, FileText, Trash2, Mail, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PdfLivePreview } from './PdfLivePreview';
import { BlobProvider, PDFDownloadLink } from '@react-pdf/renderer';
import { MetricsSheet } from './MetricsSheet';
import { LinkedInSync } from './LinkedInSync';
import { BuzzwordRadar } from './BuzzwordRadar';
import ReactMarkdown from 'react-markdown';

interface Step3Props {
  initialData: ResumeData;
}

export const Step3_Workspace: React.FC<Step3Props> = ({ initialData }) => {
  const [data, setData] = useState<ResumeData>(() => ({
    ...initialData,
    preferences: {
      showPhoto: true,
      showCertifications: true,
      showProjects: true,
      showLanguages: true,
      ...initialData.preferences
    }
  }));
  const [template, setTemplate] = useState<TemplateId>('reverse-chronological');
  const [activeTab, setActiveTab] = useState<'details' | 'templates' | 'outreach'>('details');

  // Copilot State
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [copilotInput, setCopilotInput] = useState('');
  const [isCopilotLoading, setIsCopilotLoading] = useState(false);
  const [copilotHistory, setCopilotHistory] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);

  // History State
  const [history, setHistory] = useState<ResumeData[]>([{
    ...initialData,
    preferences: {
      showPhoto: true,
      showCertifications: true,
      showProjects: true,
      showLanguages: true,
      ...initialData.preferences
    }
  }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const isTraveling = useRef(false);

  // Outreach Copilot State
  const [outreachType, setOutreachType] = useState<'linkedin' | 'email'>('linkedin');
  const [targetJobDescription, setTargetJobDescription] = useState('');
  const [isGeneratingOutreach, setIsGeneratingOutreach] = useState(false);
  const [outreachResult, setOutreachResult] = useState('');

  const pushToHistory = (newData: ResumeData) => {
    if (isTraveling.current) return;
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(JSON.parse(JSON.stringify(newData)));
      if (newHistory.length > 50) newHistory.shift();
      return newHistory;
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  };

  const handleDataChange = (newData: ResumeData, immediate = false) => {
    const clonedData = JSON.parse(JSON.stringify(newData));
    setData(clonedData);
    if (isTraveling.current) return;

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (immediate) {
      pushToHistory(clonedData);
    } else {
      debounceTimer.current = setTimeout(() => {
        pushToHistory(clonedData);
      }, 1200);
    }
  };

  
  const addCompany = () => {
    const newWork = [{ company: '', roleTitle: '', dates: '', location: '', bullets: [''] }, ...(data.workExperience || [])];
    handleDataChange({ ...data, workExperience: newWork }, true);
  };
  
  const removeCompany = (index: number) => {
    const newWork = [...data.workExperience];
    newWork.splice(index, 1);
    handleDataChange({ ...data, workExperience: newWork }, true);
  };

  
  const parseDateForSort = (dateStr: string) => {
    if (!dateStr || dateStr.toLowerCase().includes('present')) return Number.MAX_SAFE_INTEGER;
    const parts = dateStr.split('-');
    const endStr = parts.length > 1 ? parts[1].trim() : parts[0].trim();
    const regex = /(\w{3,9}\s+\d{4})|(\d{1,2}\/\d{4})|(\d{4})/;
    const matches = endStr.match(regex);
    if (matches) {
       const dateSpace = endStr.match(/(\w{3,9})\s+(\d{4})/);
       if (dateSpace) {
          const months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
          const m = months.findIndex(x => dateSpace[1].toLowerCase().startsWith(x));
          return parseInt(dateSpace[2]) * 100 + (m >= 0 ? m : 0);
       }
       const dateSlash = endStr.match(/(\d{1,2})\/(\d{4})/);
       if (dateSlash) {
          return parseInt(dateSlash[2]) * 100 + parseInt(dateSlash[1]);
       }
       const yearOnly = endStr.match(/(\d{4})/);
       if (yearOnly) return parseInt(yearOnly[1]) * 100;
    }
    return 0;
  };

  const sortTimelineAndSnapshot = () => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    const sortedWork = [...(data.workExperience || [])].sort((a, b) => parseDateForSort(b.dates || '') - parseDateForSort(a.dates || ''));
    const newData = { ...data, workExperience: sortedWork };
    setData(newData);
    pushToHistory(newData);
  };

  const forceSnapshot = () => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    pushToHistory(data);
  };

  const undo = () => {
    if (historyIndex > 0) {
      isTraveling.current = true;
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setData(JSON.parse(JSON.stringify(history[newIndex])));
      setTimeout(() => { isTraveling.current = false; }, 50);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      isTraveling.current = true;
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setData(JSON.parse(JSON.stringify(history[newIndex])));
      setTimeout(() => { isTraveling.current = false; }, 50);
    }
  };

  const handleGenerateOutreach = async () => {
    setIsGeneratingOutreach(true);
    setOutreachResult('');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/generate-outreach`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeData: {
            name: data.contactInfo.fullName,
            targetTitle: data.contactInfo.targetTitle,
            coreExpertise: data.skills.coreExpertise,
            technicalTools: data.skills.technicalTools,
            methodologies: data.skills.methodologies,
            // Simple mapping for top 3 metrics (we just join top bullets)
            topMetrics: data.workExperience.map(w => w.bullets).flat().slice(0, 3) 
          },
          targetJobDescription,
          outreachType
        }),
      });
      if (!response.ok) throw new Error('Failed to generate outreach');
      const result = await response.json();
      setOutreachResult(result.pitch || result.message);
    } catch (e) {
      console.error(e);
      setOutreachResult('Failed to generate pitch. Please try again.');
    } finally {
      setIsGeneratingOutreach(false);
    }
  };

  const handleCopilotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotInput.trim() || isCopilotLoading) return;

    const userMessage = copilotInput.trim();
    setCopilotInput('');
    setCopilotHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsCopilotLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/copilot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData: data, userCommand: userMessage })
      });

      if (!response.ok) throw new Error('Copilot request failed');

      const updatedData = await response.json();

      // Deep merge and sanitize
      const sanitized = JSON.parse(JSON.stringify(updatedData));
      if (sanitized.workExperience) {
        sanitized.workExperience = sanitized.workExperience.map((wk: any) => ({
          ...wk,
          company: wk.company === null || wk.company === 'N/A' ? '' : wk.company,
          roleTitle: wk.roleTitle === null || wk.roleTitle === 'N/A' ? '' : wk.roleTitle,
          dates: wk.dates === null || wk.dates === 'N/A' ? '' : wk.dates,
          bullets: wk.bullets || [],
        }));
      }
      
      // Force a complete React state cache invalidation on the frontend using deep-cloning
      const incomingCopilotJSON = sanitized;
      setData(JSON.parse(JSON.stringify(incomingCopilotJSON)));
      pushToHistory(JSON.parse(JSON.stringify(incomingCopilotJSON)));

      setCopilotHistory(prev => [...prev, { role: 'assistant', content: 'I have updated your resume based on your request. Take a look at the preview!' }]);
    } catch (error) {
      console.error(error);
      setCopilotHistory(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsCopilotLoading(false);
    }
  };

  const updateContact = (field: keyof ResumeData['contactInfo'], value: string) => {
    handleDataChange({
      ...data,
      contactInfo: { ...data.contactInfo, [field]: value }
    });
  };

  const updateRootString = (field: keyof Pick<ResumeData, 'professionalSummary' | 'linkedinUrl' | 'portfolioUrl'>, value: string) => {
    handleDataChange({
      ...data,
      [field]: value
    });
  }

  const updateWork = (index: number, field: string, value: any) => {
    const newWork = [...data.workExperience];
    newWork[index] = { ...newWork[index], [field]: value };
    handleDataChange({ ...data, workExperience: newWork });
  };

  const updateWorkHighlight = (workIndex: number, highlightIndex: number, value: string) => {
    const newWork = [...data.workExperience];
    const newHighlights = [...newWork[workIndex].bullets];
    newHighlights[highlightIndex] = value;
    newWork[workIndex] = { ...newWork[workIndex], bullets: newHighlights };
    handleDataChange({ ...data, workExperience: newWork });
  };


  const removeBullet = (workIndex: number, highlightIndex: number) => {
    const newWork = JSON.parse(JSON.stringify(data.workExperience || []));
    newWork[workIndex].bullets.splice(highlightIndex, 1);
    const newData = { ...data, workExperience: newWork };
    setData(JSON.parse(JSON.stringify(newData)));
    pushToHistory(JSON.parse(JSON.stringify(newData)));
  };

  const addBullet = (workIndex: number) => {
    const newWork = JSON.parse(JSON.stringify(data.workExperience || []));
    if (!newWork[workIndex].bullets) {
      newWork[workIndex].bullets = [];
    }
    newWork[workIndex].bullets.push('');
    const newData = { ...data, workExperience: newWork };
    setData(JSON.parse(JSON.stringify(newData)));
    pushToHistory(JSON.parse(JSON.stringify(newData)));
  };

  const [polishingState, setPolishingState] = useState<Record<string, boolean>>({});

  const polishBullet = async (workIndex: number, highlightIndex: number, text: string) => {
    if (!text.trim()) return;
    const key = `${workIndex}-${highlightIndex}`;
    setPolishingState(prev => ({ ...prev, [key]: true }));
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/rephrase-bullet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bullet: text,
          roleTitle: data.workExperience[workIndex].roleTitle,
          company: data.workExperience[workIndex].company,
          targetRole: data.contactInfo.targetTitle
        })
      });
      if (!response.ok) throw new Error('Failed to polish');
      const result = await response.json();
      
      const newWork = JSON.parse(JSON.stringify(data.workExperience || []));
      newWork[workIndex].bullets[highlightIndex] = result.polishedBullet;
      const newData = { ...data, workExperience: newWork };
      setData(JSON.parse(JSON.stringify(newData)));
      pushToHistory(JSON.parse(JSON.stringify(newData)));
    } catch(error) {
      console.error(error);
    } finally {
      setPolishingState(prev => ({ ...prev, [key]: false }));
    }
  };

  const togglePreference = (pref: keyof NonNullable<ResumeData['preferences']>) => {
    handleDataChange({
      ...data,
      preferences: {
        ...data.preferences!,
        [pref]: !data.preferences![pref]
      }
    }, true);
  }

  const updateSkillCategory = (category: keyof ResumeData['skills'], valueString: string) => {
    handleDataChange({
      ...data,
      skills: {
        ...data.skills,
        [category]: valueString.split(',').map(s => s.trim()).filter(Boolean)
      }
    });
  };

  const ToggleSwitch = ({ label, propName }: { label: string, propName: keyof NonNullable<ResumeData['preferences']> }) => {
    const isActive = data.preferences?.[propName] ?? true;
    return (
      <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
        <button
          onClick={() => togglePreference(propName)}
          className={`relative w-11 h-6 rounded-full transition-colors flex items-center ${isActive ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'}`}
        >
          <div className={`absolute left-1 w-4 h-4 rounded-full bg-white transition-transform ${isActive ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row h-full overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl">
      {/* LEFT PANEL: EDITING CONTROLS */}
      <div className="w-full lg:w-1/2 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 relative h-[50vh] lg:h-auto">
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 justify-between items-center">
          <div className="flex flex-1">
            <button 
              onClick={() => setActiveTab('details')}
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${activeTab === 'details' ? 'border-b-2 border-indigo-600 text-indigo-700 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              Edit Content & Settings
            </button>
            <button 
              onClick={() => setActiveTab('templates')}
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${activeTab === 'templates' ? 'border-b-2 border-indigo-600 text-indigo-700 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              Change Template
            </button>
            <button 
              onClick={() => setActiveTab('outreach')}
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${activeTab === 'outreach' ? 'border-b-2 border-indigo-600 text-indigo-700 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              Outreach Copilot
            </button>
          </div>
          <div className="flex items-center gap-1 pr-4">
            <button 
              onClick={undo}
              disabled={historyIndex === 0}
              className="p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md disabled:opacity-30 transition-colors"
              title="Undo"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button 
              onClick={redo}
              disabled={historyIndex === history.length - 1}
              className="p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md disabled:opacity-30 transition-colors"
              title="Redo"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar-hide flex flex-col">
          {activeTab === 'templates' ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <TemplatePicker selected={template} onSelect={setTemplate} />
            </motion.div>
          ) : activeTab === 'outreach' ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-indigo-100 dark:border-indigo-900/50 shadow-sm border-t-4 border-t-indigo-600">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">Outreach Settings</h3>
                
                <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 mb-6">
                  <button
                    onClick={() => setOutreachType('linkedin')}
                    className={`flex-1 py-2 text-sm font-medium rounded-md flex items-center justify-center gap-2 transition-all ${outreachType === 'linkedin' ? 'bg-white dark:bg-slate-700 shadow text-indigo-700 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    💬 LinkedIn DM
                  </button>
                  <button
                    onClick={() => setOutreachType('email')}
                    className={`flex-1 py-2 text-sm font-medium rounded-md flex items-center justify-center gap-2 transition-all ${outreachType === 'email' ? 'bg-white dark:bg-slate-700 shadow text-indigo-700 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                  >
                    <Mail className="w-4 h-4" />
                    ✉️ Cold Email
                  </button>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Target Job Description</label>
                  <textarea
                    value={targetJobDescription}
                    onChange={(e) => setTargetJobDescription(e.target.value)}
                    placeholder="Paste the job requirements here..."
                    className="w-full text-sm p-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 h-32 resize-y"
                  />
                </div>

                <button
                  onClick={handleGenerateOutreach}
                  disabled={isGeneratingOutreach || !targetJobDescription.trim()}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGeneratingOutreach ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                  Generate Pitch
                </button>
              </div>

              {outreachResult && (
                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3">Generated Pitch</h3>
                  <div className="prose prose-sm dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
                    <ReactMarkdown>{outreachResult}</ReactMarkdown>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              
              {/* SETTINGS / OPTIONAL FIELDS */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-indigo-100 dark:border-indigo-900/50 shadow-sm border-t-4 border-t-indigo-600">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">Conditional Sections</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ToggleSwitch label="Profile Photo" propName="showPhoto" />
                  <ToggleSwitch label="Certifications" propName="showCertifications" />
                  <ToggleSwitch label="Projects" propName="showProjects" />
                  <ToggleSwitch label="Languages" propName="showLanguages" />
                </div>
                <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 text-xs rounded-lg flex items-start gap-2 border border-indigo-100 dark:border-indigo-800/50">
                  <span className="shrink-0 mt-0.5">ℹ️</span>
                  <span>Toggling off a section immediately removes it from the PDF renderer to ensure strict ATS compliance.</span>
                </div>
              </div>

              {/* BASICS */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">Contact Info</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Full Name</label>
                    <input type="text" value={data.contactInfo.fullName || ''} onChange={e => updateContact('fullName', e.target.value)} onBlur={forceSnapshot} className="w-full text-sm p-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-md outline-none focus:ring-1 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Target Title</label>
                    <input type="text" value={data.contactInfo.targetTitle || ''} onChange={e => updateContact('targetTitle', e.target.value)} onBlur={forceSnapshot} className="w-full text-sm p-2 border border-indigo-200 dark:border-indigo-800/50 rounded-md font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 outline-none focus:ring-1 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Email</label>
                    <input type="email" value={data.contactInfo.email || ''} onChange={e => updateContact('email', e.target.value)} onBlur={forceSnapshot} className="w-full text-sm p-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-md outline-none focus:ring-1 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Phone</label>
                    <input type="text" value={data.contactInfo.phone || ''} onChange={e => updateContact('phone', e.target.value)} onBlur={forceSnapshot} className="w-full text-sm p-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-md outline-none focus:ring-1 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Location</label>
                    <input type="text" value={data.contactInfo.location || ''} onChange={e => updateContact('location', e.target.value)} onBlur={forceSnapshot} className="w-full text-sm p-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-md outline-none focus:ring-1 focus:ring-indigo-500" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Professional Summary</label>
                    <textarea value={data.professionalSummary || ''} onChange={e => updateRootString('professionalSummary', e.target.value)} onBlur={forceSnapshot} className="w-full text-sm p-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-md outline-none focus:ring-1 focus:ring-indigo-500 h-24 resize-none" />
                    <BuzzwordRadar textToScan={data.professionalSummary || ''} />
                  </div>
                  <div className="col-span-1">
                     <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">LinkedIn URL</label>
                     <input type="text" value={data.linkedinUrl || ''} onChange={e => updateRootString('linkedinUrl', e.target.value)} onBlur={forceSnapshot} className="w-full text-sm p-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-md outline-none focus:ring-1 focus:ring-indigo-500" />
                  </div>
                   <div className="col-span-1">
                     <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Portfolio URL</label>
                     <input type="text" value={data.portfolioUrl || ''} onChange={e => updateRootString('portfolioUrl', e.target.value)} onBlur={forceSnapshot} className="w-full text-sm p-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-md outline-none focus:ring-1 focus:ring-indigo-500" />
                  </div>
                </div>
              </div>

              {/* LINKEDIN SYNC */}
              <LinkedInSync data={data} />

              {/* SKILLS */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">Contextual Skills</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Core Expertise (Comma separated)</label>
                    <textarea value={data.skills?.coreExpertise?.join(', ') || ''} onChange={e => updateSkillCategory('coreExpertise', e.target.value)} onBlur={forceSnapshot} className="w-full text-sm p-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-md outline-none focus:ring-1 focus:ring-indigo-500 resize-none h-16" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Technical Tools (Comma separated)</label>
                    <textarea value={data.skills?.technicalTools?.join(', ') || ''} onChange={e => updateSkillCategory('technicalTools', e.target.value)} onBlur={forceSnapshot} className="w-full text-sm p-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-md outline-none focus:ring-1 focus:ring-indigo-500 resize-none h-16" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Methodologies (Comma separated)</label>
                    <textarea value={data.skills?.methodologies?.join(', ') || ''} onChange={e => updateSkillCategory('methodologies', e.target.value)} onBlur={forceSnapshot} className="w-full text-sm p-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-md outline-none focus:ring-1 focus:ring-indigo-500 resize-none h-16" />
                  </div>
                </div>
              </div>

              {/* EXPERIENCE */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2 mb-4"><h3 className="text-lg font-bold text-slate-800 dark:text-white">Work Experience (X-Y-Z Format)</h3><button onClick={() => addCompany()} className="text-xs bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 font-semibold px-3 py-1.5 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors">+ Add Company</button></div>
                {(data.workExperience || []).map((wk, i) => (
                  <div key={i} className="mb-6 pb-6 border-b border-slate-100 dark:border-slate-800 last:border-0 last:mb-0 last:pb-0 relative"><button onClick={() => removeCompany(i)} className="absolute -top-3 -right-3 text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 p-1.5 rounded-full z-10 transition-colors tooltip" aria-label="Delete Company"><Trash2 className="w-4 h-4" /></button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Company</label>
                        <input type="text" value={wk.company || ''} onChange={e => updateWork(i, 'company', e.target.value)} onBlur={forceSnapshot} className="w-full text-sm p-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-md outline-none focus:ring-1 focus:ring-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Role Title</label>
                        <input type="text" value={wk.roleTitle || ''} onChange={e => updateWork(i, 'roleTitle', e.target.value)} onBlur={forceSnapshot} className="w-full text-sm p-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-md outline-none focus:ring-1 focus:ring-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Dates (MM/YYYY)</label>
                        <input type="text" value={wk.dates || ''} onChange={e => updateWork(i, 'dates', e.target.value)} onBlur={sortTimelineAndSnapshot} className="w-full text-sm p-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-md outline-none focus:ring-1 focus:ring-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Location</label>
                        <input type="text" value={wk.location || ''} onChange={e => updateWork(i, 'location', e.target.value)} onBlur={forceSnapshot} className="w-full text-sm p-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-md outline-none focus:ring-1 focus:ring-indigo-500" />
                      </div>
                    </div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider flex items-center justify-between">
                      <span>Impact Bullets</span>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/50">X-Y-Z Certified</span>
                    </label>
                    <MetricsSheet targetRole={data.contactInfo.targetTitle} onInject={(metric) => updateWorkHighlight(i, wk.bullets.length, metric)} />
                    <div className="space-y-4 mt-3">
                      {(wk.bullets || []).map((hlt, j) => (
                        <div key={j} className="flex flex-col gap-1 group relative">
                          <div className="flex gap-2">
                            <span className="text-slate-400 dark:text-slate-500 mt-2">•</span>
                            <textarea 
                              value={hlt || ''} 
                              onChange={e => updateWorkHighlight(i, j, e.target.value)} onBlur={forceSnapshot}
                              className="w-full text-sm p-2 pr-28 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 dark:text-white focus:bg-white dark:focus:bg-slate-800 rounded-md resize-none h-20 outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            
                            <div className="absolute right-2 top-2 flex flex-col gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                               <button 
                                  onClick={() => removeBullet(i, j)} 
                                  className="p-1 px-2 text-[10px] uppercase font-bold text-red-600 bg-red-100 hover:bg-red-200 dark:bg-red-900/40 dark:hover:bg-red-800/60 dark:text-red-400 rounded transition-colors tooltip flex items-center justify-center border border-red-200 dark:border-red-800/50" 
                                  aria-label="Delete Bullet">
                                      🗑️ Delete
                               </button>
                               <button 
                                  onClick={() => polishBullet(i, j, hlt)} 
                                  disabled={polishingState[`${i}-${j}`]}
                                  className={`p-1 px-2 text-[10px] uppercase font-bold text-indigo-600 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/40 dark:hover:bg-indigo-800/60 dark:text-indigo-400 rounded transition-colors flex items-center justify-center border border-indigo-200 dark:border-indigo-800/50 ${polishingState[`${i}-${j}`] ? 'opacity-50 cursor-not-allowed' : ''}`}
                                  aria-label="Polish Bullet">
                                      {polishingState[`${i}-${j}`] ? '⏳ WAIT' : '✨ Polish'}
                               </button>
                            </div>

                          </div>
                          <div className="pl-5">
                            <BuzzwordRadar textToScan={hlt || ''} />
                          </div>
                        </div>
                      ))}
                      <div className="pl-5 pt-2">
                        <button 
                           onClick={() => addBullet(i)} 
                           className="w-full flex items-center justify-center gap-2 p-2 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-md text-sm font-semibold text-slate-500 hover:text-indigo-600 hover:border-indigo-400 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
                        >
                           <span className="text-xl leading-none">+</span> Add Custom Bullet Point
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </motion.div>
          )}
        </div>
        
        {/* DOWNLOAD BAR */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.5)] z-10 sticky bottom-0">
          <div className="flex flex-col sm:flex-row gap-3">
            <PDFDownloadLink document={<ResumeDocument data={data} templateId={template} />} fileName={`${data.contactInfo.fullName?.replace(/ /g, '_') || 'Resume'}_Resume.pdf`} className="flex-1">
              {({ loading }) => (
                <button disabled={loading} className="w-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-indigo-600 dark:hover:bg-indigo-500 font-semibold shadow-lg py-3 rounded-xl flex items-center justify-center gap-2 transition-all h-full">
                  {loading ? 'Preparing PDF...' : (
                    <>
                      <Download className="w-5 h-5" />
                      Download Final ATS PDF
                    </>
                  )}
                </button>
              )}
            </PDFDownloadLink>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: LIVE PDF PREVIEW */}
      <div className="w-full lg:w-1/2 bg-slate-200 dark:bg-slate-950 relative h-[50vh] lg:h-auto border-t lg:border-t-0 border-slate-300 dark:border-slate-800 overflow-hidden">
        <BlobProvider document={<ResumeDocument data={data} templateId={template} />}>
          {({ blob, loading }) => (
            <PdfLivePreview blob={blob} />
          )}
        </BlobProvider>

        {/* COPILOT FAB */}
        <button
          onClick={() => setIsCopilotOpen(true)}
          className={`absolute bottom-6 right-6 p-4 rounded-full shadow-2xl bg-indigo-600 hover:bg-indigo-700 text-white transition-transform ${isCopilotOpen ? 'scale-0' : 'scale-100'} focus:outline-none focus:ring-4 focus:ring-indigo-500/50 flex items-center justify-center`}
          aria-label="Open Copilot"
        >
          <Sparkles className="w-6 h-6" />
        </button>

        {/* COPILOT SIDEBAR */}
        <AnimatePresence>
          {isCopilotOpen && (
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="absolute top-0 right-0 w-full sm:w-96 h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-50 flex flex-col"
            >
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-indigo-600 dark:text-indigo-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white text-sm">Resume Copilot</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">AI Refinement Assistant</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCopilotOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar-hide bg-slate-50/50 dark:bg-slate-900/50">
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-xl rounded-tl-none shadow-sm text-sm text-slate-700 dark:text-slate-200">
                  <p>Hi! I'm your Resume Copilot. How can I help refine your content?</p>
                  <ul className="mt-2 text-xs text-slate-500 dark:text-slate-400 space-y-1 list-disc list-inside">
                    <li>"Make my summary sound more executive"</li>
                    <li>"Shorten bullet points to fix overflow"</li>
                    <li>"Translate this to a Software Engineer focus"</li>
                  </ul>
                </div>
                
                {copilotHistory.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-xl text-sm shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-tl-none'}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                
                {isCopilotLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-xl rounded-tl-none shadow-sm text-sm text-slate-700 dark:text-slate-200 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                      Refining resume...
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                <form onSubmit={handleCopilotSubmit} className="relative">
                  <input
                    type="text"
                    value={copilotInput}
                    onChange={(e) => setCopilotInput(e.target.value)}
                    placeholder="Ask Copilot..."
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-300 dark:focus:border-indigo-700 focus:bg-white dark:focus:bg-slate-900 rounded-full pl-4 pr-12 py-3 text-sm outline-none transition-all dark:text-white"
                    disabled={isCopilotLoading}
                  />
                  <button
                    type="submit"
                    disabled={!copilotInput.trim() || isCopilotLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
