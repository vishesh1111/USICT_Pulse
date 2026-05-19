fetch('http://www.ipu.ac.in/usict/usictsfacultymain.php')
  .then(res => res.text())
  .then(text => {
    const fs = require('fs');
    fs.writeFileSync('faculty.html', text);
    console.log('Saved to faculty.html');
  })
  .catch(err => console.error(err));
