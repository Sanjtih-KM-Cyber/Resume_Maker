const fs = require('fs');

let content = fs.readFileSync('src/utils/pdfTemplates.tsx', 'utf8');

content = content.replace(/\{data\.workExperience\.map\(/g, '{(data.workExperience || []).map(');
content = content.replace(/\{w\.bullets\.map\(/g, '{(w.bullets || []).map(');
content = content.replace(/\{data\.education\.map\(/g, '{(data.education || []).map(');
content = content.replace(/\{data\.certifications\.map\(/g, '{(data.certifications || []).map(');
content = content.replace(/\{data\.projects\.map\(/g, '{(data.projects || []).map(');
content = content.replace(/\{data\.languages\.map\(/g, '{(data.languages || []).map(');

fs.writeFileSync('src/utils/pdfTemplates.tsx', content);

// Also do the same for Step3_Workspace.tsx arrays
let workspaceContent = fs.readFileSync('src/components/Step3_Workspace.tsx', 'utf8');
workspaceContent = workspaceContent.replace(/\{data\.workExperience\.map\(/g, '{(data.workExperience || []).map(');
workspaceContent = workspaceContent.replace(/\{wk\.bullets\.map\(/g, '{(wk.bullets || []).map(');

fs.writeFileSync('src/components/Step3_Workspace.tsx', workspaceContent);
console.log("Replaced arrays");
