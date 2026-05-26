const fs = require('fs');

let serverFile = fs.readFileSync('api/index.ts', 'utf8');

const newAnalyzePrompt = `You are a strict, highly analytical ATS parsing engine. Your ONLY job is to analyze the text provided in the "Original Resume" block below.
DO NOT INVENT COMPANIES. DO NOT USE PLACEHOLDERS LIKE "ABC Company", "ABC Corporation" or "DEF Startups". YOU MUST EXTRACT THE EXACT COMPANY NAMES FROM THE TEXT BELOW.

Original Resume:
"""
\${resumeText}
"""

STEP 1: Extract every single Company Name and Job Title exactly as they appear in the Original Resume text above.
STEP 2: Calculate the total years of professional experience from the earliest date to the latest date.
STEP 3: For each extracted company, generate 1 to 2 hyper-focused, metric-driven questions targeting missing data in their specific bullet points.

CRITICAL TONE CONSTRAINT - Adapt the questions based on total years of experience:
- Brackets 0-7 Years (The "Execution & Impact" Tier): Focus on deep technical execution, hard skills, specific tool stacks, specific failure-handling scenarios, and individual contributions to a team environment.
- Brackets 8-20 Years (The "Strategy & Transformation" Tier): Focus on strategic and systemic thinking. Target team structures, multi-million dollar budget allocations, risk mitigation, P&L scope, and navigating corporate bureaucracy to push large initiatives through.
- Brackets 20-50 Years (The "Legacy & Governance" Tier): Focus on governance, macroeconomic adaptability, public crisis handling, driving company-wide equity value, and defining long-term corporate sustainability.

DO NOT ASK LAZY QUESTIONS. Read the specific bullet points provided for that company in the text. Ask a highly specific, hyper-targeted question about a missing metric from their actual bullets. For example, if they say they "led a team", ask exactly how many people were on the team and what their localized budget was.

CRITICAL CONSTRAINT: If an employment duration at a single company exceeds 4 years, inject this mandatory question: "You spent X years at [Real Company Name]. To ensure the ATS registers your upward mobility, what internal title promotions, tier advancements, or scope changes did you achieve during this time?"

Return ONLY a strictly formatted JSON object containing a single key "results" which is an array matching this schema:
{
  "companyName": "string (MUST BE EXTRACTED FROM RESUME)",
  "roleTitle": "string",
  "tenureYears": number,
  "questions": ["string"]
}`;

// Use string split and replace to completely nuke the old prompt.
const startToken = 'const prompt = `Analyze this resume against the target role of "${targetRole}".';
const endToken = 'Resume:\n${resumeText}`;';

if (serverFile.includes(startToken) && serverFile.includes(endToken)) {
    const beforePrompt = serverFile.split(startToken)[0];
    const afterPrompt = serverFile.split(endToken)[1];
    serverFile = beforePrompt + 'const prompt = `' + newAnalyzePrompt.replace(/\${/g, '\\${') + '`;' + afterPrompt;
}

fs.writeFileSync('api/index.ts', serverFile);
