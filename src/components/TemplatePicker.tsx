import React, { useState } from 'react';
import { TemplateId } from '../types';
import { LayoutTemplate, ChevronDown, ChevronUp, FolderOpen, Briefcase, Cpu, GraduationCap, Image as ImageIcon, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TemplatePickerProps {
  selected: TemplateId;
  onSelect: (id: TemplateId) => void;
}

interface TemplateFolder {
  id: string;
  name: string;
  icon: React.ReactNode;
  templates: { id: TemplateId; name: string; description: string; color: string }[];
}

const folders: TemplateFolder[] = [
  {
    id: 'folder-1',
    name: 'CHRONOLOGICAL & CORE CORPORATE',
    icon: <Briefcase className="w-5 h-5 text-slate-600 dark:text-slate-400" />,
    templates: [
      { id: 'reverse-chronological', name: 'Reverse-Chronological', description: 'Traditional vertical stack, newest first.', color: 'bg-slate-100 dark:bg-slate-700' },
      { id: 'minimalist', name: 'Minimalist', description: 'High density, strict B&W, thin lines.', color: 'bg-stone-50 dark:bg-stone-800' },
      { id: 'executive', name: 'Executive', description: 'Premium typography, leadership focus.', color: 'bg-indigo-50 dark:bg-indigo-900/30' },
      { id: 'ats-max', name: 'ATS Max', description: 'Ultra-plain, keyword-spaced, 100% parse rate.', color: 'bg-gray-100 dark:bg-gray-800' },
      { id: 'one-page-condensed', name: 'One-Page Condensed', description: 'Tight tracking to fit up to 7 years in one page.', color: 'bg-zinc-100 dark:bg-zinc-800' },
    ]
  },
  {
    id: 'folder-2',
    name: 'HYBRID, TECH & SPECIALIST',
    icon: <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
    templates: [
      { id: 'combination-hybrid', name: 'Combination Hybrid', description: 'Large multi-column structural skills matrix.', color: 'bg-blue-50 dark:bg-blue-900/30' },
      { id: 'technical', name: 'Technical', description: 'Engineering focus with sub-categories.', color: 'bg-sky-50 dark:bg-sky-900/30' },
      { id: 'project-focused', name: 'Project-Focused', description: 'Prioritizes specific project outcomes and tools.', color: 'bg-cyan-50 dark:bg-cyan-900/30' },
      { id: 'startup-minimal', name: 'Startup Minimal', description: 'Geometric fonts, tight tracking.', color: 'bg-fuchsia-50 dark:bg-fuchsia-900/30' },
      { id: 'targeted-precision', name: 'Targeted Precision', description: 'Custom headline mapped to targeted title.', color: 'bg-violet-50 dark:bg-violet-900/30' },
    ]
  },
  {
    id: 'folder-3',
    name: 'FUNCTIONAL & TRANSITION',
    icon: <GraduationCap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
    templates: [
      { id: 'functional-skills', name: 'Functional Skills', description: 'Large core competencies blocks.', color: 'bg-emerald-50 dark:bg-emerald-900/30' },
      { id: 'career-changer', name: 'Career Changer', description: 'Transferable skills matrix and transition summary.', color: 'bg-teal-50 dark:bg-teal-900/30' },
      { id: 'entry-level', name: 'Entry Level', description: 'Prioritizes education over history.', color: 'bg-green-50 dark:bg-green-900/30' },
      { id: 'internship-academic', name: 'Internship & Academic', description: 'Learning objectives and club milestones.', color: 'bg-lime-50 dark:bg-lime-900/30' },
    ]
  },
  {
    id: 'folder-4',
    name: 'TWO-COLUMN & PHOTO-INTEGRATED',
    icon: <ImageIcon className="w-5 h-5 text-rose-600 dark:text-rose-400" />,
    templates: [
      { id: 'modern-two-column', name: 'Modern Two-Column', description: 'Left narrowed skills column, right wide history.', color: 'bg-rose-50 dark:bg-rose-900/30' },
      { id: 'creative-pic', name: 'Creative Pic', description: 'Clean circular headshot inside left header.', color: 'bg-pink-50 dark:bg-pink-900/30' },
      { id: 'corporate-pic', name: 'Corporate Pic', description: 'Traditional square headshot in top right.', color: 'bg-orange-50 dark:bg-orange-900/30' },
      { id: 'hybrid-sidebar', name: 'Hybrid Sidebar', description: 'Tinted left sidebar full page height.', color: 'bg-amber-50 dark:bg-amber-900/30' },
    ]
  },
  {
    id: 'folder-5',
    name: 'SCHOLARLY & VISUAL SHOWCASE',
    icon: <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
    templates: [
      { id: 'academic-cv', name: 'Academic CV', description: 'Multi-page for publications and grants.', color: 'bg-purple-50 dark:bg-purple-900/30' },
      { id: 'portfolio-link-grid', name: 'Portfolio Link Grid', description: 'Features clickable GitHub strings & URLs.', color: 'bg-blue-100 dark:bg-blue-900/40' },
    ]
  },
  {
    id: 'folder-new-1',
    name: 'MODERN, CREATIVE & CHEERY',
    icon: <LayoutTemplate className="w-5 h-5 text-orange-500 dark:text-orange-400" />,
    templates: [
      { id: 'vibrant_creative', name: 'Vibrant Creative', description: 'High-energy, warm palettes for startups.', color: 'bg-orange-100 dark:bg-orange-900/30' },
      { id: 'editorial_modern', name: 'Editorial Modern', description: 'Clean asymmetric magazine layout.', color: 'bg-rose-100 dark:bg-rose-900/30' },
      { id: 'startup_bold', name: 'Startup Bold', description: 'Playful geometric accents.', color: 'bg-teal-100 dark:bg-teal-900/30' },
      { id: 'minimal_pop', name: 'Minimal Pop', description: 'Clean base with pastel color bursts.', color: 'bg-amber-100 dark:bg-amber-900/30' },
      { id: 'compact_hybrid', name: 'Compact Hybrid', description: 'Dense but highly stylized.', color: 'bg-fuchsia-100 dark:bg-fuchsia-900/30' },
      { id: 'fresh_canvas', name: 'Fresh Canvas', description: 'Bright mint and coral fresh aesthetics.', color: 'bg-emerald-100 dark:bg-emerald-900/30' },
    ]
  },
  {
    id: 'folder-new-2',
    name: 'EXECUTIVE & GOVERNANCE',
    icon: <Briefcase className="w-5 h-5 text-emerald-800 dark:text-emerald-300" />,
    templates: [
      { id: 'boardroom_elite', name: 'Boardroom Elite', description: 'High-altitude classic serif layout.', color: 'bg-slate-200 dark:bg-slate-800' },
      { id: 'global_enterprise', name: 'Global Enterprise', description: 'Deep navy accents for enterprise scale.', color: 'bg-indigo-100 dark:bg-indigo-900/50' },
      { id: 'mergers_acquisitions', name: 'Mergers & Acquisitions', description: 'Heavy focus on major outcomes.', color: 'bg-emerald-50 dark:bg-emerald-900/20' },
      { id: 'sovereign_governance', name: 'Sovereign Governance', description: 'Generous margins for senior leadership.', color: 'bg-gray-100 dark:bg-gray-800' },
      { id: 'eminent_authority', name: 'Eminent Authority', description: 'Prestigious classic aesthetics.', color: 'bg-zinc-200 dark:bg-zinc-700' },
    ]
  },
  {
    id: 'folder-new-3',
    name: 'STRATEGY & OPERATIONS',
    icon: <Briefcase className="w-5 h-5 text-indigo-700 dark:text-indigo-300" />,
    templates: [
      { id: 'strategic_scale', name: 'Strategic Scale', description: 'Highlights organizational outcomes.', color: 'bg-slate-100 dark:bg-slate-800' },
      { id: 'operational_excellence', name: 'Operational Excellence', description: 'Clear horizontal rules and metrics blocks.', color: 'bg-blue-50 dark:bg-blue-900/30' },
      { id: 'cross_functional', name: 'Cross Functional', description: 'Structured slate and deep indigo headings.', color: 'bg-indigo-50 dark:bg-indigo-900/40' },
      { id: 'p_l_champion', name: 'P&L Champion', description: 'Emphasizes budget and scale ownership.', color: 'bg-emerald-50 dark:bg-emerald-900/30' },
      { id: 'agile_transformation', name: 'Agile Transformation', description: 'Structured charcoal matrices.', color: 'bg-gray-100 dark:bg-gray-800' },
    ]
  },
  {
    id: 'folder-new-4',
    name: 'TECHNICAL & INFRASTRUCTURE',
    icon: <Cpu className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
    templates: [
      { id: 'faang_optimized', name: 'FAANG Optimized', description: 'Ultra-dense, highly parsable technical format.', color: 'bg-slate-100 dark:bg-slate-800' },
      { id: 'matrix_functional', name: 'Matrix Functional', description: 'Split-panes for dense tool stacks.', color: 'bg-cyan-50 dark:bg-cyan-900/30' },
      { id: 'systems_architect', name: 'Systems Architect', description: 'Functional multi-column grid layouts.', color: 'bg-sky-50 dark:bg-sky-900/30' },
      { id: 'algorithmic_clean', name: 'Algorithmic Clean', description: 'Steel blue accents and clean code aesthetic.', color: 'bg-blue-50 dark:bg-blue-900/40' },
      { id: 'devops_scale', name: 'DevOps Scale', description: 'Compact display for infrastructure data.', color: 'bg-zinc-100 dark:bg-zinc-800' },
    ]
  }
];

export const TemplatePicker: React.FC<TemplatePickerProps> = ({ selected, onSelect }) => {
  // Find which folder contains the currently selected template
  const initialFolder = folders.find(f => f.templates.some(t => t.id === selected))?.id || folders[0].id;
  const [activeFolder, setActiveFolder] = useState<string>(initialFolder);

  return (
    <div className="space-y-4">
      {folders.map(folder => {
        const isOpen = activeFolder === folder.id;
        
        return (
          <div key={folder.id} className="border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
            <button
              onClick={() => setActiveFolder(isOpen ? '' : folder.id)}
              className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isOpen ? 'bg-white dark:bg-slate-700 shadow-sm' : 'bg-transparent'}`}>
                  {isOpen ? <FolderOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> : folder.icon}
                </div>
                <h2 className="font-bold text-slate-800 dark:text-slate-200 text-sm md:text-base text-left tracking-wide">
                  {folder.name}
                </h2>
              </div>
              {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </button>
            
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 border-t border-slate-200 dark:border-slate-700">
                    {folder.templates.map((tpl) => (
                      <button
                        key={tpl.id}
                        onClick={() => onSelect(tpl.id)}
                        className={`text-left p-3 rounded-xl border-2 transition-all group ${
                          selected === tpl.id 
                            ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20 dark:border-indigo-500 shadow-md transform scale-[1.02]' 
                            : 'border-slate-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <div className={`w-full h-20 ${tpl.color} rounded-lg border border-slate-200/50 dark:border-slate-700/50 mb-3 flex items-center justify-center group-hover:shadow-inner transition-all`}>
                          <LayoutTemplate className={`w-6 h-6 ${selected === tpl.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`}/>
                        </div>
                        <h3 className={`font-semibold text-sm mb-1 ${selected === tpl.id ? 'text-indigo-900 dark:text-indigo-300' : 'text-slate-800 dark:text-slate-200'}`}>
                          {tpl.name}
                        </h3>
                        <p className={`text-xs line-clamp-2 leading-relaxed ${selected === tpl.id ? 'text-indigo-700/80 dark:text-indigo-400/80' : 'text-slate-500 dark:text-slate-400'}`}>
                          {tpl.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
