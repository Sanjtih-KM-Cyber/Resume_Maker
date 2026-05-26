const fs = require('fs');

let serverFile = fs.readFileSync('server.ts', 'utf8');

serverFile = serverFile.replace(
  /const parsed = JSON\.parse\(text\);\n\s+res\.json\(parsed\.results \|\| \[\]\);/g,
  `let parsed;
      try {
        parsed = JSON.parse(text);
      } catch (e) {
        // Fallback robust json extraction if Groq adds markdown formatting like \`\`\`json
        const jsonMatch = text.match(/\\{.*\\}/s);
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

      res.json(finalResults);`
);

fs.writeFileSync('server.ts', serverFile);
