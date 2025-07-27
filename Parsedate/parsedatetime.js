const express = require('express');
const chrono = require('chrono-node');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

app.post('/parse-datetime', (req, res) => {
  const { input } = req.body;

  if (!input) {
    return res.status(400).json({ success: false, error: 'Missing input' });
  }

  const results = chrono.parse(input);

  if (!results.length) {
    return res.json({ success: false, error: 'Could not understand date/time from input.' });
  }

  const parsedDate = results[0].start.date();
  const now = new Date();

  if (parsedDate < now) {
    return res.json({ success: false, error: 'The provided date/time is in the past.' });
  }

  const date_fm = parsedDate.toLocaleDateString('en-GB'); // DD/MM/YYYY
  const hours = parsedDate.getHours().toString().padStart(2, '0');
  const minutes = parsedDate.getMinutes().toString().padStart(2, '0');
  const time_fm = `${hours}:${minutes}`; // HH:MM (24h)

  res.json({
    success: true,
    original_input: input,
    parsed_date: date_fm,
    parsed_time: time_fm,
    iso_date: parsedDate.toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
