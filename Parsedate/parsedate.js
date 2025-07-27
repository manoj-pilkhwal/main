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

  // Reject past times
  if (parsedDate < now) {
    return res.json({ success: false, error: 'The provided date/time is in the past.' });
  }

  // ⛔ Reject ambiguous time like "5" or "7:30" without AM/PM
  const hasExplicitTime = /(\d{1,2})(:\d{2})?\s?(AM|PM)/i.test(input);
  const hasTimeWithoutAmPm = /\b\d{1,2}(:\d{2})?\b/.test(input) && !hasExplicitTime;

  if (hasTimeWithoutAmPm) {
    return res.json({
      success: false,
      error: 'Time is ambiguous. Please specify AM or PM (e.g., "5 AM" or "5 PM").',
      original_input: input
    });
  }

  // Format
  const date_fm = parsedDate.toLocaleDateString('en-GB');
  const time_fm = parsedDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

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
