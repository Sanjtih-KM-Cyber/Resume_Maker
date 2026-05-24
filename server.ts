import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import * as dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

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

Return a strictly formatted JSON array where each object maps to this schema:
{
  "companyName": string,
  "roleTitle": string,
  "tenureYears": number,
  "questions": string[] // Exactly 1 to 2 (or 3 if tenure > 4) hyper-focused questions
}
Resume:
${resumeText}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                companyName: { type: Type.STRING },
                roleTitle: { type: Type.STRING },
                tenureYears: { type: Type.NUMBER },
                questions: { 
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["companyName", "roleTitle", "tenureYears", "questions"]
            }
          }
        }
      });
      
      const text = response.text || "[]";
      res.json(JSON.parse(text));
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
1. "contactInfo.targetTitle" MUST exactly be "${targetRole}".
2. "contactInfo.location" MUST be in City, State format.
3. "workExperience[].dates" MUST be in MM/YYYY format.
4. "workExperience[].bullets" MUST strictly adhere to the Google X-Y-Z formula. However, ELIMINATE REPETITIVE ACTION VERB SYNTAX. You must NEVER start consecutive bullet points with the exact same verb. Enforce a diverse vocabulary matrix utilizing active, high-impact leadership verbs (e.g., "Spearheaded", "Engineered", "Optimized", "Architected", "Championed", "Catalyzed", "Orchestrated", "Secured", "Mitigated", "Formulated"). Maintain hard metrics but weave them into natural, elegant professional narratives.
5. "skills": Group into 3 distinct arrays based on the target role: Core Expertise, Technical Tools, Methodologies.
6. TYPO CORRECTION: Actively sanitize text input. Standardize acronyms (e.g. O2C not 02C) and act as a professional proofreader.
7. PROMOTIONS: If an employment duration at a single company exceeds 4 years and involves title promotions, split them into separate chronological sub-headings as distinct items within workExperience, ordered from newest to oldest.
8. TRUTH & INTEGRITY: You are strictly forbidden from fabricating, inventing, or hallucinating any biographical, historical, or professional facts (e.g., fictional companies, fabricated metrics, random dates, tools, or degrees) that were not present in the original uploaded resume or explicitly typed by the user in the interview chat phase.
9. MULTI-PAGE & ANTI-TRUNCATION: You are strictly forbidden from optimizing the text layout to fit on a single page. Do not drop arrays, truncate lists, omit historical nodes, or shorten bullet points for the sake of page real-estate. Assume the document has an infinite vertical scroll budget. If there are 4 companies, output all 4 companies with their complete metrics, and let the frontend canvas naturally render across subsequent pages.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              contactInfo: {
                type: Type.OBJECT,
                properties: {
                  fullName: { type: Type.STRING },
                  email: { type: Type.STRING },
                  phone: { type: Type.STRING },
                  location: { type: Type.STRING },
                  targetTitle: { type: Type.STRING }
                },
                required: ["fullName", "email", "phone", "location", "targetTitle"]
              },
              professionalSummary: { type: Type.STRING },
              skills: { 
                type: Type.OBJECT,
                properties: {
                  coreExpertise: { type: Type.ARRAY, items: { type: Type.STRING } },
                  technicalTools: { type: Type.ARRAY, items: { type: Type.STRING } },
                  methodologies: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["coreExpertise", "technicalTools", "methodologies"]
              },
              workExperience: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    company: { type: Type.STRING },
                    roleTitle: { type: Type.STRING },
                    dates: { type: Type.STRING, description: "MM/YYYY format" },
                    location: { type: Type.STRING },
                    bullets: { 
                      type: Type.ARRAY, 
                      items: { type: Type.STRING },
                      description: "Must strictly adhere to the Google X-Y-Z formula: Accomplished [X], as measured by [Y], by doing [Z]"
                    }
                  },
                  required: ["company", "roleTitle", "dates", "location", "bullets"]
                }
              },
              education: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    institution: { type: Type.STRING },
                    degree: { type: Type.STRING },
                    graduationYear: { type: Type.STRING }
                  },
                  required: ["institution", "degree", "graduationYear"]
                }
              },
              linkedinUrl: { type: Type.STRING },
              portfolioUrl: { type: Type.STRING },
              certifications: { type: Type.ARRAY, items: { type: Type.STRING } },
              projects: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ["title", "description"]
                }
              },
              languages: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["contactInfo", "professionalSummary", "skills", "workExperience", "education"]
          }
        }
      });
      
      const text = response.text || "{}";
      res.json(JSON.parse(text));
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
MULTI-PAGE & ANTI-TRUNCATION: You are strictly forbidden from optimizing or truncating the output text payload layout to artificially fit on a single page canvas. Assume the workspace document has an infinite vertical scroll budget. If there are 4 distinct companies within the state array, you must explicitly output all 4 companies with their full descriptive metrics. It is fully acceptable and intended for the final resume document to cleanly overflow and spill over onto Page 2, Page 3, or more depending on historical content density. The application rendering pipeline must NEVER clip, slice, or drop entire historical data records to preserve single page parameters.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              contactInfo: {
                type: Type.OBJECT,
                properties: {
                  fullName: { type: Type.STRING },
                  email: { type: Type.STRING },
                  phone: { type: Type.STRING },
                  location: { type: Type.STRING },
                  targetTitle: { type: Type.STRING }
                },
                required: ["fullName", "email", "phone", "location", "targetTitle"]
              },
              professionalSummary: { type: Type.STRING },
              skills: { 
                type: Type.OBJECT,
                properties: {
                  coreExpertise: { type: Type.ARRAY, items: { type: Type.STRING } },
                  technicalTools: { type: Type.ARRAY, items: { type: Type.STRING } },
                  methodologies: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["coreExpertise", "technicalTools", "methodologies"]
              },
              workExperience: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    company: { type: Type.STRING },
                    roleTitle: { type: Type.STRING },
                    dates: { type: Type.STRING, description: "MM/YYYY format" },
                    location: { type: Type.STRING },
                    bullets: { 
                      type: Type.ARRAY, 
                      items: { type: Type.STRING },
                      description: "Must strictly adhere to the Google X-Y-Z formula: Accomplished [X], as measured by [Y], by doing [Z]"
                    }
                  },
                  required: ["company", "roleTitle", "dates", "location", "bullets"]
                }
              },
              education: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    institution: { type: Type.STRING },
                    degree: { type: Type.STRING },
                    graduationYear: { type: Type.STRING }
                  },
                  required: ["institution", "degree", "graduationYear"]
                }
              },
              linkedinUrl: { type: Type.STRING },
              portfolioUrl: { type: Type.STRING },
              profileImageBase64: { type: Type.STRING },
              certifications: { type: Type.ARRAY, items: { type: Type.STRING } },
              projects: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ["title", "description"]
                }
              },
              languages: { type: Type.ARRAY, items: { type: Type.STRING } },
              preferences: {
                type: Type.OBJECT,
                properties: {
                  showPhoto: { type: Type.BOOLEAN },
                  showCertifications: { type: Type.BOOLEAN },
                  showProjects: { type: Type.BOOLEAN },
                  showLanguages: { type: Type.BOOLEAN }
                }
              }
            },
            required: ["contactInfo", "professionalSummary", "skills", "workExperience", "education"]
          }
        }
      });
      
      const text = response.text || "{}";
      res.json(JSON.parse(text));
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
Return a JSON array of 5 strings.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      });
      res.json(JSON.parse(response.text || "[]"));
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

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
      });
      res.json({ pitch: response.text });
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
Return JSON with 'headline' and 'about' properties.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              headline: { type: Type.STRING },
              about: { type: Type.STRING }
            },
            required: ["headline", "about"]
          }
        }
      });
      res.json(JSON.parse(response.text || "{}"));
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

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt
      });

      // The returned string might include quotes or markdown depending on model output.
      let polishedBullet = (response.text || "").trim();
      polishedBullet = polishedBullet.replace(/^"|"$/g, '').replace(/^[\*\-\s]+/, '');

      res.json({ polishedBullet });

    } catch (error: any) {
      console.error("Rephrase Bullet Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
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

startServer();
