const fs = require('fs');

let serverFile = fs.readFileSync('api/index.ts', 'utf8');

const newAnalyzePrompt = `Analyze this resume against the target role of "\${targetRole}".
Identify all work experiences (companies) listed in the resume.
FIRST, calculate the total cumulative years of professional experience across the entire resume.
Then, for each company, evaluate the provided title against the target job description and generate contextual questions targeting missing metrics, scale, budgets, team sizes, or specific project outcome numbers.

CRITICAL TONE CONSTRAINT: You MUST adapt the complexity and tone of the questions based on the candidate's total years of experience:
- 0-2 Years: Ask tactical questions about specific tasks, tools used, and daily execution metrics.
- 2-4 Years: Ask about project ownership, process improvements, and collaboration outcomes.
- 5-7 Years: Ask about leadership, cross-functional initiatives, and departmental impact.
- 8-10 Years: Ask about strategic planning, team leadership, and budget/financial impact.
- 10-15 Years: Ask about enterprise-wide strategy, P&L management, and organizational transformation.
- 15-20 Years: Ask about board-level reporting, M&A integrations, global scaling, and market expansion.
- 20-30 Years: Ask about legacy building, industry-wide paradigm shifts, and macroeconomic steering.
- 30-50 Years: Ask about eminent authority contributions, lifetime industry impact, and foundational architectural legacy.

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
4. "workExperience[].bullets" MUST perfectly align with the candidate's total years of experience. You must analyze the total timeline and apply the exact corresponding tone and scope:
   - 0-2 Years (Entry-Level): Focus on flawless execution, technical skill application, rapid learning, and tactical contributions.
   - 2-4 Years (Mid-Level): Focus on project ownership, process optimization, stakeholder collaboration, and measurable outcomes.
   - 5-7 Years (Senior-Level): Focus on leading initiatives, cross-functional impact, mentoring junior staff, and driving departmental metrics.
   - 8-10 Years (Manager/Director): Focus on strategic vision, team leadership, budget/P&L management, and scaling business operations.
   - 10-15 Years (Executive/VP): Focus on enterprise-wide strategy, organizational transformation, and market expansion.
   - 15-20 Years (Senior Executive/SVP): Focus on board-level reporting, global scaling, M&A integrations, and macro-financial steering.
   - 20-30 Years (Industry Veteran/C-Suite): Focus on industry-wide paradigm shifts, multi-national legacy building, and eminent thought leadership.
   - 30-50+ Years (Eminent Authority): Focus on lifetime industry impact, foundational architectural legacy, and macroeconomic steering.
   Weave the Google X-Y-Z formula (Accomplished X, measured by Y, by doing Z) naturally into flowing, high-impact narratives appropriate for their tier. ELIMINATE REPETITIVE ACTION VERBS. Use a diverse, high-caliber vocabulary matrix.
5. "skills": Group into 3 distinct arrays: Core Expertise, Technical Tools, Methodologies.
6. TYPO CORRECTION: Actively sanitize text. Standardize acronyms (e.g. O2C not O2C) and act as a professional proofreader.
7. PROMOTIONS: If an employment duration at a single company exceeds 4 years and involves title promotions, split them into separate chronological sub-headings as distinct items within workExperience, ordered from newest to oldest.
8. TRUTH & INTEGRITY: STRICTLY FORBIDDEN FROM FABRICATING. You must NOT invent or hallucinate any facts, metrics, tools, dates, or responsibilities that were not explicitly present in the original resume or provided in the interview answers. If a metric is missing, do not invent one; frame the achievement truthfully based ONLY on the provided text.
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
  "professionalSummary": "string (MUST be a commanding 3-4 line summary highlighting overall scale and impact matched exactly to their experience tier. DO NOT INVENT METRICS.)",
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
      "bullets": ["string (High-impact narrative matched to their tier. DO NOT INVENT METRICS.)"]
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
