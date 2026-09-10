const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const outDir = path.join(root, 'out');

if (!fs.existsSync(outDir)) {
  console.error('Missing out/ — run next build first');
  process.exit(1);
}

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

for (const entry of fs.readdirSync(outDir)) {
  copyRecursive(path.join(outDir, entry), path.join(root, entry));
}

console.log('Copied out/* to site root for Plesk document root.');
