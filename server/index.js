const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5174; // dev server port separate from Vite

app.use(cors()); // allow local Vite frontend to access

app.get('/api/charts', (req, res) => {
    const chartsDir = path.join(__dirname, '../public/charts');

    fs.readdir(chartsDir, (err, files) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to read chart directory' });
        }

        const csvFiles = files.filter(f => f.endsWith('.csv'));
        res.json(csvFiles);
    });
});

app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
});
