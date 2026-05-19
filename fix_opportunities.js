const fs = require('fs');
const file = 'src/app/opportunities/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Ensure we import Suspense
if (!content.includes('Suspense')) {
  content = content.replace('import * as React from "react";', 'import * as React from "react";\nimport { Suspense } from "react";');
}

// Rename component
content = content.replace('export default function OpportunitiesPage() {', 'function OpportunitiesContent() {');

// Append wrapper
content += `

export default function OpportunitiesPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8 md:py-12"><div className="animate-pulse">Loading opportunities...</div></div>}>
      <OpportunitiesContent />
    </Suspense>
  );
}
`;

fs.writeFileSync(file, content);
