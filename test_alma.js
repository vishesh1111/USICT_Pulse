fetch('https://usictipu.almaconnect.com/alumni')
  .then(res => res.text())
  .then(html => {
    const fs = require('fs');
    fs.writeFileSync('alma.html', html);
    console.log('Saved to alma.html');
  });
