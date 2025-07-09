const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const app = express();
const PORT = 3000;

app.use(express.static('public')); // serve frontend from /public

app.get('/data', (req, res) => {
  const results = [];
  fs.createReadStream('data.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => res.json(results));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
