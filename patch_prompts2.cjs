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
4. "workExperience[].bullets" MUST perfectly align with the candidate's total years of experience. You must analyze the total timeline and apply the exact corresponding tone and scope:
   - 0-2 Years (Entry-Level): Focus on flawless execution, technical skill application, rapid learning, and tactical contributions.
   - 2-5 Years (Mid-Level): Focus on project ownership, process optimization, stakeholder collaboration, and measurable outcomes.
   - 5-8 Years (Senior-Level): Focus on leading initiatives, cross-functional impact, mentoring junior staff, and driving departmental metrics.
   - 8-12 Years (Manager/Director): Focus on strategic vision, team leadership, budget/P&L management, and scaling business operations.
   - 12+ Years (Executive/VP): Focus on enterprise-wide transformation, board-level impact, global strategy, and executive leadership.
   Weave the Google X-Y-Z formula (Accomplished X, measured by Y, by doing Z) naturally into flowing, high-impact narratives appropriate for their tier. ELIMINATE REPETITIVE ACTION VERBS. Use a diverse, high-caliber vocabulary matrix.
5. "skills": Group into 3 distinct arrays: Core Expertise, Technical Tools, Methodologies.
6. TYPO CORRECTION: Actively sanitize text. Standardize acronyms (e.g. O2C not O2C) and act as a professional proofreader.
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
  "professionalSummary": "string (MUST be a commanding 3-4 line summary highlighting overall scale and impact matched exactly to their experience tier)",
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
      "bullets": ["string (High-impact narrative matched to their tier)"]
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

serverFile = serverFile.replace(/const prompt = `Act as an elite Fortune 500 Executive Resume Writer.*?\]\n\}`;/s, 'const prompt = `' + newGeneratePrompt.replace(/\${/g, '\\${') + '`;');

fs.writeFileSync('api/index.ts', serverFile);
