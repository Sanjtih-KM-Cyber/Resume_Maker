const fs = require('fs');

let content = fs.readFileSync('src/utils/pdfTemplates.tsx', 'utf8');

const regex = /(<View key=\{i\}[^>]*?)\s*wrap=\{false\}(>[\s\S]*?\n\s*<)(View|Text)(\s+style=\{\{[^}]*\}\})?([^>]*>)/g;
content = content.replace(regex, (match, viewstart, mid, childTag, childStyle, childEnd) => {
    let newChildEnd = childEnd;
    if (!childEnd.includes('wrap={false}')) {
        newChildEnd = childEnd.replace(/>$/, ' wrap={false}>');
    }
    return `${viewstart}${mid}${childTag}${childStyle || ''}${newChildEnd}`;
});

fs.writeFileSync('src/utils/pdfTemplates.tsx', content);
console.log('Update wrap complete');
