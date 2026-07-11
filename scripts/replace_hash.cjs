const fs = require('fs');
const path = require('path');

function walk(dir) {
  fs.readdirSync(dir).forEach(f => {
    let p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      walk(p);
    } else if (p.endsWith('.js')) {
      let content = fs.readFileSync(p, 'utf8');
      let newContent = content.split('href="#/').join('href="/');
      if (newContent !== content) {
        fs.writeFileSync(p, newContent);
        console.log('Replaced in ' + p);
      }
    }
  });
}

walk('X:/Aponte SAS/GranColinos/Pagina Web/Antigavity/src');
console.log('Done');
