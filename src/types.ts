export interface WorkExperience {
  company: string;
  roleTitle: string;
  dates: string;
  location: string;
  bullets: string[];
}

export interface Education {
  institution: string;
  degree: string;
  graduationYear: string;
}

export interface Project {
  title: string;
  description: string;
}

export interface SkillCategories {
  coreExpertise: string[];
  technicalTools: string[];
  methodologies: string[];
}

export interface ResumeData {
  contactInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    targetTitle: string;
  };
  professionalSummary: string;
  skills: SkillCategories;
  workExperience: WorkExperience[];
  education: Education[];

  // Optional Fields
  profileImageBase64?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  certifications?: string[];
  projects?: Project[];
  languages?: string[];

  // UI Preferences for Toggles
  preferences?: {
    showPhoto: boolean;
    showCertifications: boolean;
    showProjects: boolean;
    showLanguages: boolean;
  };
}

export type TemplateId = 
  | 'reverse-chronological'
  | 'minimalist'
  | 'executive'
  | 'ats-max'
  | 'one-page-condensed'
  | 'combination-hybrid'
  | 'technical'
  | 'project-focused'
  | 'startup-minimal'
  | 'targeted-precision'
  | 'functional-skills'
  | 'career-changer'
  | 'entry-level'
  | 'internship-academic'
  | 'modern-two-column'
  | 'creative-pic'
  | 'corporate-pic'
  | 'hybrid-sidebar'
  | 'academic-cv'
  | 'portfolio-link-grid'
  | 'modern-navy-sidebar'
  | 'creative-teal-split'
  | 'executive-gold-accent'
  | 'emerald-tech-grid'
  | 'corporate-slate'
  | 'warm-amber'
  | 'royal-purple'
  | 'minimalist-crimson'
  | 'vibrant-azure'
  | 'coral-accent'
  | 'monochrome-minimal'
  | 'forest-green-structure';

export interface InterviewCompany {
  companyName: string;
  roleTitle: string;
  tenureYears: number;
  questions: string[];
}

export type AppStep = 'upload' | 'interview' | 'workspace';
