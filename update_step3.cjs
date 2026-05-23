const fs = require('fs');

let content = fs.readFileSync('src/components/Step3_Workspace.tsx', 'utf8');

// 1. Array wrapper defensive logic implemented earlier
// 2. addCompany use unshift instead of push
content = content.replace(
  /const addCompany = \(\) => \{\n\s+const newWork = \[\.\.\.data\.workExperience, \{ company: '', roleTitle: '', dates: '', location: '', bullets: \[''\] \}\];/g,
  `const addCompany = () => {\n    const newWork = [{ company: '', roleTitle: '', dates: '', location: '', bullets: [''] }, ...(data.workExperience || [])];`
);

// 3. Add sorting logic
const sortingLogic = `
  const parseDateForSort = (dateStr: string) => {
    if (!dateStr || dateStr.toLowerCase().includes('present')) return Number.MAX_SAFE_INTEGER;
    const parts = dateStr.split('-');
    const endStr = parts.length > 1 ? parts[1].trim() : parts[0].trim();
    const regex = /(\\w{3,9}\\s+\\d{4})|(\\d{1,2}\\/\\d{4})|(\\d{4})/;
    const matches = endStr.match(regex);
    if (matches) {
       const dateSpace = endStr.match(/(\\w{3,9})\\s+(\\d{4})/);
       if (dateSpace) {
          const months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
          const m = months.findIndex(x => dateSpace[1].toLowerCase().startsWith(x));
          return parseInt(dateSpace[2]) * 100 + (m >= 0 ? m : 0);
       }
       const dateSlash = endStr.match(/(\\d{1,2})\\/(\\d{4})/);
       if (dateSlash) {
          return parseInt(dateSlash[2]) * 100 + parseInt(dateSlash[1]);
       }
       const yearOnly = endStr.match(/(\\d{4})/);
       if (yearOnly) return parseInt(yearOnly[1]) * 100;
    }
    return 0;
  };

  const sortTimelineAndSnapshot = () => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    const sortedWork = [...(data.workExperience || [])].sort((a, b) => parseDateForSort(b.dates || '') - parseDateForSort(a.dates || ''));
    const newData = { ...data, workExperience: sortedWork };
    setData(newData);
    pushToHistory(newData);
  };
`;

content = content.replace(/const forceSnapshot = \(\) => \{/, sortingLogic + '\n  const forceSnapshot = () => {');

// 4. Update the onBlur for the dates text input to call sortTimelineAndSnapshot instead of forceSnapshot
content = content.replace(
  /<input type="text" value=\{wk\.dates \|\| ''\} onChange=\{e => updateWork\(i, 'dates', e\.target\.value\)\} onBlur=\{forceSnapshot\} /g,
  `<input type="text" value={wk.dates || ''} onChange={e => updateWork(i, 'dates', e.target.value)} onBlur={sortTimelineAndSnapshot} `
);

// 5. Hard null recovery strategy and Deep Merge in Copilot Payload
// Inside handleCopilotSubmit replace: `handleDataChange(updatedData, true);` with a rigorous json parse / map implementation.

const copilotDeepClone = `
      // Deep merge and sanitize
      const sanitized = JSON.parse(JSON.stringify(updatedData));
      if (sanitized.workExperience) {
        sanitized.workExperience = sanitized.workExperience.map((wk: any) => ({
          ...wk,
          company: wk.company === null || wk.company === 'N/A' ? '' : wk.company,
          roleTitle: wk.roleTitle === null || wk.roleTitle === 'N/A' ? '' : wk.roleTitle,
          dates: wk.dates === null || wk.dates === 'N/A' ? '' : wk.dates,
          bullets: wk.bullets || [],
        }));
      }
      handleDataChange(sanitized, true);
`;

content = content.replace(/const updatedData = await response\.json\(\);\n\s+handleDataChange\(updatedData, true\);/g, `const updatedData = await response.json();\n${copilotDeepClone}`);

fs.writeFileSync('src/components/Step3_Workspace.tsx', content);
console.log('Applied Step3 structural changes');
