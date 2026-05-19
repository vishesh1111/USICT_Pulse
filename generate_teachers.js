const fs = require('fs');
const html = fs.readFileSync('faculty.html', 'utf8');

const results = [];
const regex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
let match;

// skip header
regex.exec(html);

function cleanHtmlText(str) {
  return str.replace(/<[^>]+>/g, '').replace(/[\r\n\t]+/g, ' ').replace(/&nbsp;/g, ' ').trim();
}

function extractLink(str) {
  const linkMatch = str.match(/href="([^"]+)"/);
  return linkMatch ? linkMatch[1] : undefined;
}

let count = 4;

while ((match = regex.exec(html)) !== null) {
  const rowHtml = match[1];
  const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
  const cols = [];
  let tdMatch;
  while ((tdMatch = tdRegex.exec(rowHtml)) !== null) {
    cols.push(tdMatch[1]);
  }
  
  if (cols.length >= 5) {
    const rawName = cols[1];
    let name = cleanHtmlText(rawName).split('[')[0].trim();
    if(name.endsWith('<br>')) name = name.replace('<br>', '');
    
    let designation = cleanHtmlText(cols[2]);
    let email = cleanHtmlText(cols[3]);
    let profileLink = extractLink(cols[4]);

    if (!name || name === 'Name') continue;
    
    // Some logic for realistic branch assignments to match our types
    // Since real faculty at USICT teach CSE, IT, ECE
    const branches = ["CSE", "IT", "ECE"];
    const branch = branches[Math.floor(Math.random() * branches.length)];
    
    // Dummy Subjects
    const subjects = ["Computer Networks", "Artificial Intelligence", "Operating Systems", "Data Structures", "Electronics"];
    const subjectList = [subjects[Math.floor(Math.random() * subjects.length)]];
    
    const teacher = {
      id: `t-${count++}`,
      name: name,
      branch: branch,
      subjects: subjectList,
      designation: designation,
      photoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
      bio: "Details imported from the USICT directory.",
      yearTaught: [1, 2, 3, 4],
      rating: +(Math.random() * 2 + 3).toFixed(1), // random 3.0-5.0
      internalsTrend: "Average",
      difficulty: "Moderate",
      teachingNature: "Professional",
      profileLink: profileLink,
      reviews: []
    };
    results.push(teacher);
  }
}

fs.writeFileSync('new_teachers.json', JSON.stringify(results, null, 2));
console.log('Saved ' + results.length + ' teachers to new_teachers.json');
