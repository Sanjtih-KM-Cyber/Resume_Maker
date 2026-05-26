const fs = require('fs');

let serverFile = fs.readFileSync('api/index.ts', 'utf8');

const newAnalyzePrompt = `Analyze this resume against the target role of "\${targetRole}".
Identify all work experiences (companies) listed in the resume.
FIRST, mathematically calculate the total cumulative years of professional experience by analyzing the earliest start date and the most recent end date across the entire resume.
Then, for each individual company, evaluate the provided title against the target job description. Generate EXACTLY 1 to 2 hyper-focused, metric-driven questions custom to this role and company targeting missing scale, budgets, or specific project outcome numbers.

CRITICAL TONE CONSTRAINT: You MUST adapt the complexity and interview focus of the questions based on the candidate's total years of experience:
- Brackets 0-7 Years (The "Execution & Impact" Tier): Focus on deep technical execution, hard skills, specific tool stacks, specific failure-handling scenarios, and individual contributions to a team environment.
- Brackets 8-20 Years (The "Strategy & Transformation" Tier): Focus on strategic and systemic thinking. Target team structures, multi-million dollar budget allocations, risk mitigation, P&L scope, and navigating corporate bureaucracy to push large initiatives through.
- Brackets 20-50 Years (The "Legacy & Governance" Tier): Focus on governance, macroeconomic adaptability, public crisis handling, driving company-wide equity value, and defining long-term corporate sustainability.

DO NOT ASK LAZY QUESTIONS. Do not ask generic questions like "Can you describe your experience with leadership?". You must read the specific bullet points provided for that company and ask a highly specific, hyper-targeted question about a missing metric from their bullets. For example, if they say they "led a team", ask exactly how many people were on the team and what their localized budget was.

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

serverFile = serverFile.replace(/const prompt = `Analyze this resume against the target role.*?Resume:\n\$\{resumeText\}`;/s, 'const prompt = `' + newAnalyzePrompt.replace(/\${/g, '\\${') + '`;');

fs.writeFileSync('api/index.ts', serverFile);
