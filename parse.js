const fs = require('fs');
const html = fs.readFileSync('faculty.html', 'utf8');

const results = [];
// Assuming there are rows with <td>
const regex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
let match;
while ((match = regex.exec(html)) !== null) {
  const rowHtml = match[1];
  const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
  const cols = [];
  let tdMatch;
  while ((tdMatch = tdRegex.exec(rowHtml)) !== null) {
    cols.push(tdMatch[1].trim());
  }
  if (cols.length >= 2) {
    results.push(cols);
  }
}

console.log(JSON.stringify(results.slice(0, 10), null, 2));
