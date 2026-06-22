const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Remove hook imports
  content = content.replace(/import\s*\{\s*useTranslated(Object)?Constants[^}]*\}\s*from\s*['"][^'"]+['"];?/g, '');

  // Find all useTranslatedConstants(XXX)
  content = content.replace(/useTranslatedConstants\(([^)]+)\)/g, (match, constantName) => {
    return `${constantName}.map(item => ({ ...item, label: intl.formatMessage({ id: \`app.constant.\${item.value || item}\`, defaultMessage: item.label || item }) }))`;
  });

  // Find all useTranslatedObjectConstants(XXX)
  content = content.replace(/useTranslatedObjectConstants\(([^)]+)\)/g, (match, constantName) => {
    return `Object.keys(${constantName}).reduce((acc, key) => { acc[key] = intl.formatMessage({ id: \`app.constant.\${key}\`, defaultMessage: ${constantName}[key] }); return acc; }, {})`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Processed ${filePath}`);
  }
}

function walkSync(dir, filelist = []) {
  if (!fs.existsSync(dir)) return filelist;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      filelist = walkSync(filepath, filelist);
    } else if (/\.(js|jsx|ts|tsx)$/.test(filepath)) {
      filelist.push(filepath);
    }
  }
  return filelist;
}

const files = walkSync(srcDir);
files.forEach(processFile);

console.log('Done replacing hooks!');
