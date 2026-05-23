import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Briefcase, FileText, FileUp, File as FileIcon } from 'lucide-react';
import { motion } from 'motion/react';
import * as pdfjsLib from 'pdfjs-dist';

// Set up pdf.js worker using Vite's ?url to fetch it directly from node_modules
// @ts-ignore
import pdfjsWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl;

interface Step1Props {
  onComplete: (resumeText: string, targetRole: string, pictureBase64?: string) => void;
}

export const Step1_Upload: React.FC<Step1Props> = ({ onComplete }) => {
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [pictureBase64, setPictureBase64] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeUploadRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPictureBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const extractTextFromPDF = async (buffer: ArrayBuffer) => {
    try {
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map((item: any) => item.str);
        text += strings.join(' ') + '\n\n';
      }
      return text;
    } catch (err) {
      console.error("PDF Extraction error:", err);
      return '';
    }
  };

  const handleResumeFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsExtracting(true);
    try {
      if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const text = await extractTextFromPDF(arrayBuffer);
        setResumeText(text);
      } else {
        const text = await file.text();
        setResumeText(text);
      }
    } catch (error) {
      console.error('Error reading resume file:', error);
      alert('Failed to read the file. Please Try pasting the text manually.');
    } finally {
      setIsExtracting(false);
      if (resumeUploadRef.current) {
        resumeUploadRef.current.value = '';
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim() || !targetRole.trim()) return;
    setIsLoading(true);
    onComplete(resumeText, targetRole, pictureBase64);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto"
    >
      <div className="mb-8 text-center mt-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
          Bypass the <span className="text-indigo-600 dark:text-indigo-400">ATS Bot</span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Upload your raw background data and target role. We'll extract, analyze, and generate an ATS-optimized standard formatting.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 space-y-8">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Target Role / Job Title
          </label>
          <input
            required
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. Senior Frontend Engineer"
            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all shadow-sm"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Paste Current Resume / LinkedIn Data
            </label>
            <div>
              <input
                type="file"
                accept=".pdf,.txt"
                className="hidden"
                ref={resumeUploadRef}
                onChange={handleResumeFileUpload}
              />
              <button
                type="button"
                onClick={() => resumeUploadRef.current?.click()}
                disabled={isExtracting}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors disabled:opacity-50"
              >
                {isExtracting ? (
                  <>
                    <div className="w-3 h-3 border-2 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin" />
                    Extracting...
                  </>
                ) : (
                  <>
                    <FileUp className="w-3.5 h-3.5" />
                    Upload PDF / TXT
                  </>
                )}
              </button>
            </div>
          </div>
          <textarea
            required
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your textual resume data here, or use the button above to upload a PDF/TXT file."
            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all h-64 resize-none shadow-sm font-mono text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center justify-between flex-wrap gap-2">
            <span className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Profile Picture (Optional)
            </span>
            <span className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded-md border border-amber-200 dark:border-amber-800 font-medium">
              ⚠️ ATS Note: Recommended only for EU/ME regions. US/UK parsers may reject.
            </span>
          </label>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
            {pictureBase64 ? (
               <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-indigo-100 dark:border-indigo-900 shadow-inner group">
                 <img src={pictureBase64} alt="Profile preview" className="w-full h-full object-cover" />
                 <button 
                  type="button" 
                  onClick={() => setPictureBase64(undefined)}
                  className="absolute inset-0 bg-slate-900/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium backdrop-blur-[2px]"
                 >
                   Remove
                 </button>
               </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-16 h-16 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:border-indigo-500 hover:text-indigo-600 dark:hover:border-indigo-400 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
              >
                <Upload className="w-6 h-6" />
              </button>
            )}
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Supports JPG, PNG (Max 2MB)
            </div>
          </div>
        </div>

        <button
          disabled={isLoading || !resumeText.trim() || !targetRole.trim()}
          type="submit"
          className="w-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-indigo-600 dark:hover:bg-indigo-500 font-semibold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analysis in Progress...
            </>
          ) : (
            'Generate ATS Draft →'
          )}
        </button>
      </form>
    </motion.div>
  );
};

