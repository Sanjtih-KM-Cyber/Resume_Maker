const fs = require('fs');

let content = fs.readFileSync('server.ts', 'utf8');

const promptAdditions1 = `
7. PROMOTIONS: If an employment duration at a single company exceeds 4 years and involves title promotions, split them into separate chronological sub-headings as distinct items within workExperience, ordered from newest to oldest.
8. TRUTH & INTEGRITY: You are strictly forbidden from fabricating, inventing, or hallucinating any biographical, historical, or professional facts (e.g., fictional companies, fabricated metrics, random dates, tools, or degrees) that were not present in the original uploaded resume or explicitly typed by the user in the interview chat phase.
9. MULTI-PAGE & ANTI-TRUNCATION: You are strictly forbidden from optimizing the text layout to fit on a single page. Do not drop arrays, truncate lists, omit historical nodes, or shorten bullet points for the sake of page real-estate. Assume the document has an infinite vertical scroll budget. If there are 4 companies, output all 4 companies with their complete metrics, and let the frontend canvas naturally render across subsequent pages.
`;

const promptAdditions2 = `
CRITICAL MANDATE: You must NEVER drop structural objects, companies, or work experiences from the array unless explicitly told to remove a specific one. If the user asks to "make it shorter", you must compress the wording of individual bullet points using concise action verbs rather than omitting entire history blocks.
TRUTH & INTEGRITY: You are strictly forbidden from fabricating, inventing, or hallucinating any biographical, historical, or professional facts (e.g., fictional companies, fabricated metrics, random dates, tools, or degrees) that were not present in the original uploaded resume or explicitly typed by the user in the interview chat phase.
MULTI-PAGE & ANTI-TRUNCATION: You are strictly forbidden from optimizing or truncating the output text payload layout to artificially fit on a single page canvas. Assume the workspace document has an infinite vertical scroll budget. If there are 4 distinct companies within the state array, you must explicitly output all 4 companies with their full descriptive metrics. It is fully acceptable and intended for the final resume document to cleanly overflow and spill over onto Page 2, Page 3, or more depending on historical content density. The application rendering pipeline must NEVER clip, slice, or drop entire historical data records to preserve single page parameters.
`;

content = content.replace(/7\. PROMOTIONS: [^\n]*/, promptAdditions1.trim());

content = content.replace(/CRITICAL MANDATE: You must NEVER drop structural objects[^\n]*/, promptAdditions2.trim());

fs.writeFileSync('server.ts', content);
console.log('Updated prompts');
