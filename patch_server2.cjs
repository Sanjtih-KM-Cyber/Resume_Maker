const fs = require('fs');

let serverFile = fs.readFileSync('server.ts', 'utf8');

// Also update the /api/generate endpoint to handle json markdown blocks
serverFile = serverFile.replace(
  /const text = response\.choices\[0\]\?\.message\?\.content \|\| "\{\}";\n\s+res\.json\(JSON\.parse\(text\)\);/g,
  `const text = response.choices[0]?.message?.content || "{}";
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch (e) {
        const jsonMatch = text.match(/\\{.*\\}/s);
        if (jsonMatch) {
          try { parsed = JSON.parse(jsonMatch[0]); } catch(e2) { parsed = {}; }
        } else {
          parsed = {};
        }
      }
      res.json(parsed);`
);

// Also update /api/copilot
serverFile = serverFile.replace(
  /const text = response\.choices\[0\]\?\.message\?\.content \|\| "\{\}";\n\s+res\.json\(JSON\.parse\(text\)\);/g,
  `const text = response.choices[0]?.message?.content || "{}";
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch (e) {
        const jsonMatch = text.match(/\\{.*\\}/s);
        if (jsonMatch) {
          try { parsed = JSON.parse(jsonMatch[0]); } catch(e2) { parsed = {}; }
        } else {
          parsed = {};
        }
      }
      res.json(parsed);`
);

fs.writeFileSync('server.ts', serverFile);
