const fs = require('fs');

let serverFile = fs.readFileSync('api/index.ts', 'utf8');

const newAnalyzePrompt = `Analyze this resume against the target role of "\${targetRole}".
Identify all work experiences (companies) listed in the resume.
FIRST, calculate the total cumulative years of professional experience across the entire resume.
Then, for each company, evaluate the provided title against the target job description and generate contextual questions targeting missing metrics, scale, budgets, team sizes, or specific project outcome numbers.

CRITICAL TONE CONSTRAINT: You MUST adapt the complexity and interview focus of the questions based on the candidate's total years of experience:
- Brackets 0-7 Years (The "Execution & Impact" Tier): Focus on deep technical execution, hard skills, specific tool stacks, specific failure-handling scenarios, and individual contributions to a team environment.
- Brackets 8-20 Years (The "Strategy & Transformation" Tier): Focus on strategic and systemic thinking. Target team structures, multi-million dollar budget allocations, risk mitigation, P&L scope, and navigating corporate bureaucracy to push large initiatives through.
- Brackets 20-50 Years (The "Legacy & Governance" Tier): Focus on governance, macroeconomic adaptability, public crisis handling, driving company-wide equity value, and defining long-term corporate sustainability.

Generate exactly 1 to 2 hyper-focused, metric-driven questions custom to this role and company that match the calculated seniority level.
CRITICAL CONSTRAINT: If you detect an employment duration at a single company that exceeds 4 years, you MUST programmatically inject a mandatory scheduling question into that specific company's question array: "You spent X years at [Company Name]. To ensure the ATS registers your upward mobility, what internal title promotions, tier advancements, or scope changes did you achieve during this time?"

Return a strictly formatted JSON object containing a single key "results" which is an array where each object maps to this schema:
{
  "companyName": string,
  "roleTitle": string,
  "tenureYears": number,
  "questions": string[]
}
Resume:
\${resumeText}`;

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
4. "workExperience[].bullets" MUST perfectly align with the candidate's total years of experience. You must analyze the total timeline and apply the exact corresponding tone, scope, and phrasing expectations:

CAREER MATRIX DEFINITIONS:
- 0–2 Years (Execution): Focus on high-quality tactical execution, core technical skill application, rapid learning agility, and error-free individual contributions under direct supervision.
- 2–4 Years (Ownership): Focus on independent project ownership, process optimization, data-backed troubleshooting, and close cross-functional stakeholder collaboration.
- 5–7 Years (Leadership): Focus on leading high-impact initiatives, formal mentoring of junior staff, expanding domain scope, and directly driving departmental metrics or business unit KPIs.
- 8–10 Years (Strategy): Focus on strategic vision mapping, multi-team leadership, localized budget management, operational scaling, and aligning technical execution with long-term business goals.
- 10–15 Years (Executive): Focus on entire business unit or departmental transformation, heavy P&L/budget ownership, portfolio diversification, organizational architecture, and setting multi-year operational roadmaps.
- 15–20 Years (Enterprise Transformation): Focus on corporate governance, enterprise-wide change management, global strategy alignment, board-level reporting, and orchestrating massive cross-departmental capital allocation.
- 20–30 Years (Industry Veteran / Board Level): Focus on macroeconomic navigation, market-defining mergers and acquisitions (M&A), regulatory or compliance steering, and advising public or private boards on long-term corporate viability.
- 30–50 Years (Legacy / Eminent Industry Authority): Focus on lifetime industry impact, shaping global sector policy or foundational architectural standards, piloting organization-wide legacy preservation, and high-altitude economic steering.

PHRASING & EXPECTATION RULES:
- Brackets 0–7 Years: Heavy emphasis on hard skills, specific technical tool stacks, and clear, localized metrics. Use active, operational verbs like Engineered, Developed, Optimized, Streamlined, and Maintained.
- Brackets 8–20 Years: You MUST completely drop task-level descriptions (no basic software tools or day-to-day administrative tasks). Highlight P&L scope, organizational scale, and cross-functional changes. Language shifts entirely to visionary, commanding verbs like Orchestrated, Spearheaded, Championed, Restructured, and Catalyzed.
- Brackets 20–50 Years: High-level curation. At this stage, reserve 80% of space for board placements, massive turnarounds, joint ventures, or industry-wide contributions. Use high-altitude governance verbs like Steered, Advised, Structured, Formulated, and Governed.

Weave the Google X-Y-Z formula (Accomplished X, measured by Y, by doing Z) naturally into these frameworks.
5. "skills": Group into 3 distinct arrays: Core Expertise, Technical Tools, Methodologies.
6. TYPO CORRECTION: Actively sanitize text. Standardize acronyms.
7. PROMOTIONS: If duration > 4 years with promotions, split into chronological sub-headings.
8. TRUTH & INTEGRITY: STRICTLY FORBIDDEN FROM FABRICATING. Do not invent metrics, tools, or facts not present in inputs.
9. MULTI-PAGE & ANTI-TRUNCATION: Output complete metrics for all companies.

You MUST return a JSON object with the following structure:
{
  "contactInfo": {
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "targetTitle": "string"
  },
  "professionalSummary": "string (MUST be a commanding 3-4 line summary highlighting overall scale and impact matched exactly to their experience tier & vocabulary expectations. DO NOT INVENT METRICS.)",
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
      "bullets": ["string (High-impact narrative matched to their tier's phrasing rules. DO NOT INVENT METRICS.)"]
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

// Replace analyze prompt
serverFile = serverFile.replace(/const prompt = `Analyze this resume against the target role.*?Resume:\n\$\{resumeText\}`;/s, 'const prompt = `' + newAnalyzePrompt.replace(/\${/g, '\\${') + '`;');

// Replace generate prompt
serverFile = serverFile.replace(/const prompt = `Act as an elite Fortune 500 Executive Resume Writer.*?\]\n\}`;/s, 'const prompt = `' + newGeneratePrompt.replace(/\${/g, '\\${') + '`;');

fs.writeFileSync('api/index.ts', serverFile);
