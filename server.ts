import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import Groq from "groq-sdk";
import * as dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: '50mb' }));

  // API Route: Analyze (Generates missing metrics/follow-up questions)
  app.post("/api/analyze", async (req, res) => {
    try {
      const { resumeText, targetRole } = req.body;

      if (!resumeText || !targetRole) {
        return res.status(400).json({ error: "Missing resumeText or targetRole" });
      }

      const prompt = `Analyze this resume against the target role of "${targetRole}". 
Identify all work experiences (companies) listed in the resume.
For each company, evaluate the provided title against the target job description and generate contextual questions targeting missing metrics, scale, budgets, team sizes, or specific project outcome numbers.
Generate exactly 1 to 2 hyper-focused, metric-driven questions custom to this role and company.
CRITICAL CONSTRAINT: If you detect an employment duration at a single company that exceeds 4 years, you MUST programmatically inject a mandatory scheduling question into that specific company's question array: "You spent X years at [Company Name]. To ensure the ATS registers your upward mobility, what internal title promotions, tier advancements, or scope changes did you achieve during this time?"

Return a strictly formatted JSON object containing a single key "results" which is an array where each object maps to this schema:
{
  "companyName": string,
  "roleTitle": string,
  "tenureYears": number,
  "questions": string[] // Exactly 1 to 2 (or 3 if tenure > 4) hyper-focused questions
}
Resume:
${resumeText}`;

      const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const text = response.choices[0]?.message?.content || "{}";
            let parsed;
      try {
        parsed = JSON.parse(text);
      } catch (e) {
        const jsonMatch = text.match(/[\[\{].*[\]\}]/s);
        if (jsonMatch) {
          try {
             parsed = JSON.parse(jsonMatch[0]);
          } catch(e2) {
             parsed = { results: [] };
          }
        } else {
          parsed = { results: [] };
        }
      }

      // Some Groq models might return the array directly despite the prompt
      let finalResults = [];
      if (Array.isArray(parsed)) {
        finalResults = parsed;
      } else if (parsed && Array.isArray(parsed.results)) {
        finalResults = parsed.results;
      } else if (parsed && parsed.companyName) {
        // If it accidentally returned a single object instead of array
        finalResults = [parsed];
      }

      res.json(finalResults);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  // API Route: Generate (Compiles final JSON)
  app.post("/api/generate", async (req, res) => {
    try {
      const { resumeText, targetRole, interviewAnswers } = req.body;

      const prompt = `Act as an expert ATS Resume Writer. I need to convert a messy resume and interview answers into a perfectly structured JSON object matching the target role of "${targetRole || 'Professional'}".
      
Original Resume:
${resumeText || 'Make one up based on role'}

Interview Answers mapping to missing data gaps:
${interviewAnswers || 'None'}

Create an optimized resume JSON structure based on this information. 
CRITICAL DATA CONSTRAINTS:

THE 0-50 YEAR CAREER MATRIX:
You must determine the candidate's exact years of experience based on the earliest date in their work history and map their entire linguistic profile to one of the following brackets.
- 0–3 Years (Entry/Junior): Focus on execution, specific tools, and granular metrics or outputs.
- 3–8 Years (Mid-Level): Focus on project ownership, cross-functional collaboration, system optimization, and localized team leadership. Translate basic tasks into metrics or business unit KPIs.
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
3. BRACKETS 15–30 YEARS: The 80/20 REAL ESTATE RULE (Chronological Curation). Allocate 80% of the text weight to the last 10-12 years, but DO NOT drop bullets completely. Condense older roles to 1-2 highly impactful bullets instead of dropping them.
4. BRACKETS 30–50 YEARS: Focus heavily on high-altitude summaries of systemic corporate turnarounds, board seats, and lifetime industry contributions. Condense older history to 1 powerful bullet per role to prevent multi-page bloat without losing the data points.

MULTI-PAGE & ANTI-TRUNCATION SAFEGUARD:
While enforcing the curation rules above, you are strictly forbidden from randomly slicing or dropping entire historical company blocks from the state array. Maintain the layout budget by compressing the text weight of individual bullet points rather than omitting entire history records.

5. "skills": Group into 3 distinct arrays based on the target role: Core Expertise, Technical Tools, Methodologies.
6. TYPO CORRECTION: Actively sanitize text input. Standardize acronyms (e.g. O2C not 02C) and act as a professional proofreader.
7. PROMOTIONS: If an employment duration at a single company exceeds 4 years and involves title promotions, split them into separate chronological sub-headings as distinct items within workExperience, ordered from newest to oldest.
8. TRUTH & INTEGRITY: You are strictly forbidden from fabricating facts. HOWEVER, you MUST formulate professional achievements into the Google X-Y-Z format ("Accomplished [X], as measured by [Y], by doing [Z]"). If exact metrics aren't provided, use qualitative impact measures (e.g. "scaled system architecture to handle enterprise workloads", "reduced operational latency", "improved cross-functional alignment").
9. ATS OPTIMIZATION (CRITICAL): Ensure impeccable spelling and grammar. Never use the exact same action verb (e.g., "Managed", "Developed") more than once per company. Diversify vocabulary (e.g., Orchestrated, Architected, Spearheaded, Championed, Formulated). Quantify impact wherever logically inferable without lying.

You MUST return a JSON object with the following structure:
{
  "contactInfo": {
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "targetTitle": "string"
  },
  "professionalSummary": "string",
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
      "bullets": ["string (Google X-Y-Z formula)"]
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
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });
      
      const text = response.choices[0]?.message?.content || "{}";
            let parsed;
      try {
        parsed = JSON.parse(text);
      } catch (e) {
        const jsonMatch = text.match(/[\[\{].*[\]\}]/s);
        if (jsonMatch) {
          try { parsed = JSON.parse(jsonMatch[0]); } catch(e2) { parsed = {}; }
        } else {
          parsed = {};
        }
      }
      res.json(parsed);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  // API Route: Copilot (Refines existing JSON via Chat)
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

Apply the requested changes to the resume data. Return ONLY the fully updated structured resume JSON object.
Ensure you strictly follow the resume schema.
CRITICAL MANDATE: You must NEVER drop structural objects, companies, or work experiences from the array unless explicitly told to remove a specific one. If the user asks to "make it shorter", you must compress the wording of individual bullet points using concise action verbs rather than omitting entire history blocks.
TRUTH & INTEGRITY: You are strictly forbidden from fabricating, inventing, or hallucinating any biographical, historical, or professional facts (e.g., fictional companies, fabricated metrics, random dates, tools, or degrees) that were not present in the original uploaded resume or explicitly typed by the user in the interview chat phase.
MULTI-PAGE & ANTI-TRUNCATION: You are strictly forbidden from optimizing or truncating the output text payload layout to artificially fit on a single page canvas. Assume the workspace document has an infinite vertical scroll budget. If there are 4 distinct companies within the state array, you must explicitly output all 4 companies with their full descriptive metrics. It is fully acceptable and intended for the final resume document to cleanly overflow and spill over onto Page 2, Page 3, or more depending on historical content density. The application rendering pipeline must NEVER clip, slice, or drop entire historical data records to preserve single page parameters.

Ensure you return a JSON object that matches the structure of the input JSON Resume Data exactly.`;

      const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });
      
      const text = response.choices[0]?.message?.content || "{}";
            let parsed;
      try {
        parsed = JSON.parse(text);
      } catch (e) {
        const jsonMatch = text.match(/[\[\{].*[\]\}]/s);
        if (jsonMatch) {
          try { parsed = JSON.parse(jsonMatch[0]); } catch(e2) { parsed = {}; }
        } else {
          parsed = {};
        }
      }
      res.json(parsed);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  // API Route: Generate Metrics Cheat Sheet
  app.post("/api/metrics", async (req, res) => {
    try {
      const { targetRole } = req.body;
      if (!targetRole) return res.status(400).json({ error: "Missing targetRole" });

      const prompt = `You are an expert resume writer. Generate 5 highly realistic, pre-quantified metric templates customized exactly to the job title: "${targetRole}". 
These should be bullet points following the Google X-Y-Z formula (Accomplished [X], as measured by [Y], by doing [Z]).
Return a JSON object with a single key "metrics" which is an array of 5 strings.`;

      const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });
      let parsed;
      try {
        parsed = JSON.parse(response.choices[0]?.message?.content || "{}");
      } catch (e) {
        const text = response.choices[0]?.message?.content || "{}";
        const jsonMatch = text.match(/[\[\{].*[\]\}]/s);
        if (jsonMatch) {
          try { parsed = JSON.parse(jsonMatch[0]); } catch(e2) { parsed = {}; }
        } else {
          parsed = {};
        }
      }
      res.json(parsed.metrics || []);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  // API Route: Outreach Generator
  app.post("/api/generate-outreach", async (req, res) => {
    try {
      const { resumeData, targetJobDescription, outreachType } = req.body;
      if (!resumeData || !targetJobDescription) return res.status(400).json({ error: "Missing required fields" });

      let prompt = '';
      if (outreachType === 'linkedin') {
        prompt = `You are an expert tech recruiter and networking strategist. Write a highly optimized Cold LinkedIn DM based on this user's resume data matching the provided Target Job Description.
CRITICAL CONSTRAINTS:
1. MAX BUDGET: 600 characters total. It must be extremely punchy.
2. Skip formal greeting blocks. Do NOT use "Dear [Name]" or "Hi [Name],". Start immediately.
3. Lead with a punchy 1-sentence hook connecting the user's background to the company's product space.
4. Highlight EXACTLY 1 standout percentage metric from the user's top achievements. Do not flood with stats.
5. End with a very brief, low-friction call-to-action to connect or chat.

User Name: ${resumeData.name}
Target Role: ${resumeData.targetTitle}
Top Metrics: ${JSON.stringify(resumeData.topMetrics)}
Core Expertise: ${JSON.stringify(resumeData.coreExpertise)}
Technical Tools: ${JSON.stringify(resumeData.technicalTools)}

Target Job Description:
${targetJobDescription}`;
      } else {
        prompt = `You are an expert executive sales representative and tech recruiter. Write a highly optimized Cold Email Pitch based on this user's resume data matching the provided Target Job Description.
CRITICAL CONSTRAINTS:
1. Optimized for a 150-word scannable framework.
2. Must generate an attention-grabbing subject line in this format format: "[Core Value Prop] / [Skill] Strategy — ${resumeData.name}" (e.g., "P2P Process Optimization / Systems Automation Strategy — ${resumeData.name}"). Put the subject line as the very first line starting with "Subject: ".
3. Include a personalized greeting (e.g. "Hi team," or "Hi [Hiring Manager],").
4. Formulate a high-impact 3-bullet matrix of achievements derived from the user's top metrics. Do not use more than 3 bullets.
5. Provide a direct call-to-action requesting a brief sync.
6. Make it crisp, executive, and highly readable.

User Name: ${resumeData.name}
Target Role: ${resumeData.targetTitle}
Top Metrics: ${JSON.stringify(resumeData.topMetrics)}
Core Expertise: ${JSON.stringify(resumeData.coreExpertise)}
Technical Tools: ${JSON.stringify(resumeData.technicalTools)}

Target Job Description:
${targetJobDescription}`;
      }

      const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
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

      const prompt = `Transform the following resume summary into a high-impact, hook-driven LinkedIn Profile "About/Bio Section" (limit to 2 paragraphs) and an attention-grabbing 220-character "Professional Headline".
Target Title: ${title || 'Professional'}
Summary: ${summary}
Return a JSON object with 'headline' and 'about' properties.`;

      const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });
      let parsed;
      try {
        parsed = JSON.parse(response.choices[0]?.message?.content || "{}");
      } catch (e) {
        const text = response.choices[0]?.message?.content || "{}";
        const jsonMatch = text.match(/[\[\{].*[\]\}]/s);
        if (jsonMatch) {
          try { parsed = JSON.parse(jsonMatch[0]); } catch(e2) { parsed = {}; }
        } else {
          parsed = {};
        }
      }
      res.json(parsed);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });



  app.post("/api/rephrase-bullet", async (req, res) => {
    try {
      const { bullet, roleTitle, company, targetRole } = req.body;
      if (!bullet || !roleTitle || !company || !targetRole) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const prompt = `
You are an expert executive resume writer. Your task is to polish the following raw bullet point provided by a user.
Currently, it describes a duty or achievement for the role of "${roleTitle}" at "${company}". The user is targeting a "${targetRole}" role.

RAW BULLET:
"${bullet}"

OBJECTIVE:
1. Translate this messy or raw input into a single high-impact, quantified sentence.
2. Strictly follow the executive Google X-Y-Z formula ("Accomplished [X], as measured by [Y], by doing [Z]").
3. Use active, high-impact leadership verbs (e.g., Spearheaded, Engineered, Optimized, Architected) without being repetitive.
4. Output ONLY the polished string payload. Do not include quotes, prefixes, bullet points, or any extra text.
`;

      const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
      });

      // The returned string might include quotes or markdown depending on model output.
      let polishedBullet = (response.choices[0]?.message?.content || "").trim();
      polishedBullet = polishedBullet.replace(/^"|"$/g, '').replace(/^[\*\-\s]+/, '');

      res.json({ polishedBullet });

    } catch (error: any) {
      console.error("Rephrase Bullet Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  async function startViteServer() {
    if (process.env.NODE_ENV !== "production") {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), "dist");
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
  startViteServer();


