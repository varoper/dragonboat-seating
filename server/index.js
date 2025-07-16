const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5174;

app.use(cors());

// API route for chart files
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

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(__dirname, '../dist');
    app.use(express.static(distPath));

    app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'nichi.html')); // Adjust if renamed differently
    });
}

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
