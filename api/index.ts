import express from "express";
import Groq from "groq-sdk";
import * as dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const app = express();

app.use(express.json({ limit: '50mb' }));

function parseGroqResponse(text) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    const jsonMatch = text.match(/\{.*\}/s);
    if (jsonMatch) {
      try { parsed = JSON.parse(jsonMatch[0]); } catch(e2) { parsed = {}; }
    } else {
      parsed = {};
    }
  }
  return parsed;
}

app.post("/api/analyze", async (req, res) => {
  try {
    const { resumeText, targetRole } = req.body;

    if (!resumeText || !targetRole) {
      return res.status(400).json({ error: "Missing resumeText or targetRole" });
    }

    const prompt = `You are a strict, highly analytical ATS parsing engine. Your ONLY job is to analyze the text provided in the "Original Resume" block below.
DO NOT INVENT COMPANIES. DO NOT USE PLACEHOLDERS LIKE "ABC Company", "ABC Corporation" or "DEF Startups". YOU MUST EXTRACT THE EXACT COMPANY NAMES FROM THE TEXT BELOW.

Original Resume:
"""
${resumeText}
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

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const text = response.choices[0]?.message?.content || "{}";
    const parsed = parseGroqResponse(text);

    let finalResults = [];
    if (Array.isArray(parsed)) {
      finalResults = parsed;
    } else if (parsed && Array.isArray(parsed.results)) {
      finalResults = parsed.results;
    } else if (parsed && parsed.companyName) {
      finalResults = [parsed];
    }

    res.json(finalResults);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/generate", async (req, res) => {
  try {
    const { resumeText, targetRole, interviewAnswers } = req.body;

    const prompt = `Act as an elite Fortune 500 Executive Resume Writer. I need to convert a raw resume and interview answers into a perfectly structured JSON object matching the target role of "${targetRole || 'Professional'}".

Original Resume:
${resumeText || 'Make one up based on role'}

Interview Answers mapping to missing data gaps:
${interviewAnswers || 'None'}

Create an optimized resume JSON structure based on this information.
CRITICAL DATA CONSTRAINTS:
1. "contactInfo.targetTitle" MUST exactly be "${targetRole}".
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

THE RESUME PAGE-BUDGET & CURATION RULES (Enforce these constraints on the density of your output):
1. BRACKETS 0–4 YEARS: Layout must be highly dense and compressed. Optimize sentence lengths so it fits onto a single page canvas.
2. BRACKETS 5–15 YEARS: Expect a solid 2 Pages. Do not compromise readability by crushing text. Write robust, detailed paragraphs.
3. BRACKETS 15–30 YEARS: The 80/20 REAL ESTATE RULE (Chronological Curation). Allocate 80% of the text weight to the last 10-12 years. EARLY CAREER COMPRESSION: For any historical roles or employment nodes older than 15 years, compress them aggressively. Drop granular task descriptions entirely and output them as a dense "Early Professional History" block containing only the Company Name, Title, and Dates by passing an EMPTY ARRAY for their bullets block: "bullets": [].
4. BRACKETS 30–50 YEARS: Focus heavily on high-altitude summaries of systemic corporate turnarounds, board seats, and lifetime industry contributions. Early career history must be deeply aggregated (empty bullet arrays) to prevent multi-page bloat.

MULTI-PAGE & ANTI-TRUNCATION SAFEGUARD:
While enforcing the curation rules above, you are strictly forbidden from randomly slicing or dropping entire historical company blocks from the state array. Maintain the layout budget by compressing the text weight of individual bullet points rather than omitting entire history records.

5. "skills": Group into 3 distinct arrays: Core Expertise, Technical Tools, Methodologies.
6. TYPO CORRECTION: Actively sanitize text. Standardize acronyms.
7. PROMOTIONS: If duration > 4 years with promotions, split into chronological sub-headings.
8. TRUTH & INTEGRITY: STRICTLY FORBIDDEN FROM FABRICATING. Do not invent metrics, tools, or facts not present in inputs.

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
      "bullets": ["string (High-impact narrative matched to their tier's phrasing rules. Empty array [] for jobs older than 15 years to enforce 80/20 curation rule. DO NOT INVENT METRICS.)"]
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

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const text = response.choices[0]?.message?.content || "{}";
    res.json(parseGroqResponse(text));
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// API Route: Copilot
app.post("/api/copilot", async (req, res) => {
  try {
    const { resumeData, userCommand } = req.body;

    if (!resumeData || !userCommand) {
      return res.status(400).json({ error: "Missing resumeData or userCommand" });
    }

    const prompt = `Act as an expert ATS Resume Writer. You are responding to a refinement command from a user regarding their resume.

Current JSON Resume Data:
${JSON.stringify(resumeData, null, 2)}

User Request: "${userCommand}"

Apply the requested changes to the resume data. Return ONLY the fully updated structured resume JSON object.`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const text = response.choices[0]?.message?.content || "{}";
    res.json(parseGroqResponse(text));
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// API Route: Metrics
app.post("/api/metrics", async (req, res) => {
  try {
    const { targetRole } = req.body;
    if (!targetRole) return res.status(400).json({ error: "Missing targetRole" });

    const prompt = `You are an expert resume writer. Generate 5 highly realistic, pre-quantified metric templates customized exactly to the job title: "${targetRole}".
These should be bullet points following the Google X-Y-Z formula.
Return a JSON object with a single key "metrics" which is an array of 5 strings.`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });
    const text = response.choices[0]?.message?.content || "{}";
    const parsed = parseGroqResponse(text);
    res.json(parsed.metrics || []);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// API Route: Generate Outreach
app.post("/api/generate-outreach", async (req, res) => {
  try {
    const { resumeData, targetJobDescription, outreachType } = req.body;
    if (!resumeData || !targetJobDescription) return res.status(400).json({ error: "Missing required fields" });

    const prompt = `Write outreach.`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      messages: [{ role: "user", content: prompt }],
    });
    res.json({ pitch: response.choices[0]?.message?.content || "" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// API Route: LinkedIn Sync
app.post("/api/linkedin", async (req, res) => {
  try {
    const { summary, title } = req.body;
    if (!summary) return res.status(400).json({ error: "Missing summary" });

    const prompt = `Return a JSON object with 'headline' and 'about' properties.`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });
    const text = response.choices[0]?.message?.content || "{}";
    res.json(parseGroqResponse(text));
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// API Route: Rephrase Bullet
app.post("/api/rephrase-bullet", async (req, res) => {
  try {
    const { bullet, roleTitle, company, targetRole } = req.body;
    if (!bullet || !roleTitle || !company || !targetRole) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const prompt = `Rephrase bullet.`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      messages: [{ role: "user", content: prompt }],
    });

    let polishedBullet = (response.choices[0]?.message?.content || "").trim();
    polishedBullet = polishedBullet.replace(/^"|"$/g, '').replace(/^[\*\-\s]+/, '');

    res.json({ polishedBullet });

  } catch (error: any) {
    console.error("Rephrase Bullet Error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default app;
