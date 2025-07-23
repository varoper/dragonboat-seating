// generateChartIndex.js

const fs = require('fs');
const path = require('path');

const chartsDir = path.join(__dirname, 'public/charts');
const indexFile = path.join(chartsDir, 'index.json');

// Read the charts directory and write index.json
fs.readdir(chartsDir, (err, files) => {
  if (err) {
    console.error('Failed to read charts directory:', err);
    process.exit(1);
  }

  const csvFiles = files.filter(f => f.endsWith('.csv'));

  fs.writeFile(indexFile, JSON.stringify(csvFiles, null, 2), (err) => {
    if (err) {
      console.error('Failed to write index.json:', err);
      process.exit(1);
    }

    console.log(`✅ index.json generated with ${csvFiles.length} chart(s).`);
  });
});
