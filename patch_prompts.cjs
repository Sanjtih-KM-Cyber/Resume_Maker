const fs = require('fs');

let serverFile = fs.readFileSync('api/index.ts', 'utf8');

const newGeneratePrompt = `Act as an elite Fortune 500 Executive Resume Writer. I need to convert a raw resume and interview answers into a perfectly structured JSON object matching the target role of "\${targetRole || 'Professional'}".

Original Resume:
\${resumeText || 'Make one up based on role'}

Interview Answers mapping to missing data gaps:
\${interviewAnswers || 'None'}

Create an optimized resume JSON structure based on this information.
CRITICAL DATA CONSTRAINTS:
1. "contactInfo.targetTitle" MUST exactly be "\${targetRole}".
2. "contactInfo.location" MUST be in City, State format.
3. "workExperience[].dates" MUST be in MM/YYYY format.
4. "workExperience[].bullets" MUST sound like a seasoned industry veteran. DO NOT sound like a junior employee. You must adapt the tone based on the candidate's total years of experience. If they have 10+ years, elevate the wording to reflect strategic vision, enterprise-wide impact, P&L management, and cross-functional leadership. Weave the Google X-Y-Z formula (Accomplished X, measured by Y, by doing Z) naturally into flowing, high-impact executive narratives. ELIMINATE REPETITIVE ACTION VERBS. Use a diverse, high-caliber vocabulary matrix (e.g., "Architected", "Orchestrated", "Catalyzed", "Spearheaded").
5. "skills": Group into 3 distinct arrays: Core Expertise, Technical Tools, Methodologies.
6. TYPO CORRECTION: Actively sanitize text. Standardize acronyms (e.g. O2C not 02C) and act as a professional proofreader.
7. PROMOTIONS: If an employment duration at a single company exceeds 4 years and involves title promotions, split them into separate chronological sub-headings as distinct items within workExperience, ordered from newest to oldest.
8. TRUTH & INTEGRITY: NEVER fabricate facts, metrics, tools, or dates not present in the original input or interview answers.
9. MULTI-PAGE & ANTI-TRUNCATION: Never optimize layout to fit a single page. Do not drop arrays, truncate lists, or shorten historical nodes. Output complete metrics for all companies.

You MUST return a JSON object with the following structure:
{
  "contactInfo": {
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "targetTitle": "string"
  },
  "professionalSummary": "string (MUST be a commanding 3-4 line executive summary highlighting overall scale and impact)",
  "skills": {
    "coreExpertise": ["string"],
    "technicalTools": ["string"],
    "methodologies": ["string"]
  },
  "workExperience": [
    {
      "company": "string",
      "roleTitle": "string",
      "dates": "string (MM/YYYY)",
      "location": "string",
      "bullets": ["string (High-impact executive narrative)"]
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "graduationYear": "string"
    }
  ],
  "linkedinUrl": "string (optional)",
  "portfolioUrl": "string (optional)",
  "certifications": ["string (optional)"],
  "projects": [
    {
      "title": "string",
      "description": "string"
    }
  ],
  "languages": ["string (optional)"]
}`;

// Replace the old prompt assignment in /api/generate
serverFile = serverFile.replace(/const prompt = `Act as an expert ATS Resume Writer.*?\]\n\}`;/s, 'const prompt = `' + newGeneratePrompt.replace(/\${/g, '\\${') + '`;');

// Add temperature to ALL Groq API calls in api/index.ts to make it less random/creative and more analytical
serverFile = serverFile.replace(/model: "llama-3.3-70b-versatile",/g, 'model: "llama-3.3-70b-versatile",\n      temperature: 0.2,');

fs.writeFileSync('api/index.ts', serverFile);
