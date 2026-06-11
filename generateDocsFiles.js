// generateDocsFiles.js
// Copies relevant files into /docs after build

const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const docsDir = path.join(__dirname, 'docs');

const distAssets = path.join(distDir, 'assets');
const docsAssets = path.join(docsDir, 'assets');

const distIndex = path.join(distDir, 'index.html');
const docsIndex = path.
  join(docsDir, 'index.html');

// Remove old docs/assets directory
if (fs.existsSync(docsAssets)) {
  fs.rmSync(docsAssets, { recursive: true, force: true });
}

// Recreate docs directory if necessary
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

// Copy dist/assets → docs/assets
fs.cpSync(distAssets, docsAssets, { recursive: true });

// Copy dist/index.html → docs/index.html
fs.copyFileSync(distIndex, docsIndex);

console.log('GitHub Pages files updated.');
