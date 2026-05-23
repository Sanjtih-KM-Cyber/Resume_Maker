const fs = require('fs');
let content = fs.readFileSync('src/utils/pdfTemplates.tsx', 'utf8');

// The replacement logic:
const blocks = ['education', 'projects'];
for (const block of blocks) {
  const regex = new RegExp(`{\\(data\\.${block} \\|\\| \\[\\]\\)\\.map\\(\\((\\w), i\\) => \\(\\s*<View key=\\{i\\}([^>]*)>`, "g");
  content = content.replace(regex, (match, param, attrs) => {
    if (attrs.includes('wrap={false}')) return match;
    return `{(data.${block} || []).map((${param}, i) => (\n        <View key={i}${attrs} wrap={false}>`;
  });
}

fs.writeFileSync('src/utils/pdfTemplates.tsx', content);
