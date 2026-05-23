const fs = require('fs');
let content = fs.readFileSync('src/components/Step3_Workspace.tsx', 'utf8');

// adding '+ Add Company' button
content = content.replace(
  /<h3 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">Work Experience \(X-Y-Z Format\)<\/h3>/g,
  '<div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2 mb-4"><h3 className="text-lg font-bold text-slate-800 dark:text-white">Work Experience (X-Y-Z Format)</h3><button onClick={() => addCompany()} className="text-xs bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 font-semibold px-3 py-1.5 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors">+ Add Company</button></div>'
);

// adding delete company button
// Find: <div key={i} className="mb-6 pb-6 border-b border-slate-100 dark:border-slate-800 last:border-0 last:mb-0 last:pb-0">
content = content.replace(
  /<div key=\{i\} className="mb-6 pb-6 border-b border-slate-100 dark:border-slate-800 last:border-0 last:mb-0 last:pb-0">/g,
  '<div key={i} className="mb-6 pb-6 border-b border-slate-100 dark:border-slate-800 last:border-0 last:mb-0 last:pb-0 relative"><button onClick={() => removeCompany(i)} className="absolute -top-3 -right-3 text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 p-1.5 rounded-full z-10 transition-colors tooltip" aria-label="Delete Company"><Trash2 className="w-4 h-4" /></button>'
);

// add addCompany and removeCompany functions
const functionsToAdd = `
  const addCompany = () => {
    const newWork = [...data.workExperience, { company: '', roleTitle: '', dates: '', location: '', bullets: [''] }];
    handleDataChange({ ...data, workExperience: newWork }, true);
  };
  
  const removeCompany = (index: number) => {
    const newWork = [...data.workExperience];
    newWork.splice(index, 1);
    handleDataChange({ ...data, workExperience: newWork }, true);
  };
`;
// Put it right after handleDataChange
content = content.replace(/const forceSnapshot = \(\) => {/, functionsToAdd + '\n  const forceSnapshot = () => {');

// import Trash2 if missing
if (!content.includes('Trash2')) {
  content = content.replace(/import { ([^}]+) } from 'lucide-react';/, "import { $1, Trash2 } from 'lucide-react';");
}

fs.writeFileSync('src/components/Step3_Workspace.tsx', content);
console.log('Added CRUD features');
