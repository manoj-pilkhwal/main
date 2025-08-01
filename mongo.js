const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const mongoURI = 'mongodb+srv://manojpilkhwal6:oSQ3l5hyHBFhgLhc@cluster0.w27johq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Schema
const shiftSchema = new mongoose.Schema({
  facility_id: { type: String, required: true },
  hospital_name: { type: String, required: true },
  phone_number: { type: Number, required: true },
  shift_id: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  user_name: { type: String } // ✅ new optional field
});

const Shift = mongoose.model('Shift', shiftSchema);

// POST API — DO NOT TOUCH
app.post('/shifts', async (req, res) => {
  try {
    const { facility_id, date, time } = req.body;

    if (!facility_id || !date || !time) {
      return res.status(400).json({ success: false, message: 'facility_id, date, and time are required' });
    }

    const existingShift = await Shift.findOne({ facility_id, date, time });
    if (existingShift) {
      return res.status(409).json({
        success: false,
        message: 'Shift already scheduled on this date and time'
      });
    }

    const referenceFacility = await Shift.findOne({ facility_id });
    if (!referenceFacility) {
      return res.status(404).json({ success: false, message: 'Facility not found' });
    }

    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');

    let shift_id;
    let isUnique = false;
    while (!isUnique) {
      const random = Math.floor(1000 + Math.random() * 9000);
      shift_id = `SHIFT${day}${month}-${random}`;
      const existingId = await Shift.findOne({ shift_id });
      if (!existingId) isUnique = true;
    }

    const newShift = new Shift({
      facility_id,
      hospital_name: referenceFacility.hospital_name,
      phone_number: referenceFacility.phone_number,
      shift_id,
      date,
      time,
      user_name: referenceFacility.user_name || null // Preserve user_name if exists
    });

    await newShift.save();

    res.status(201).json({
      success: true,
      message: 'Shift created successfully',
      shift_id
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Updated GET API to include user_name
app.get('/facility', async (req, res) => {
  try {
    const { phone_number } = req.query;
    if (!phone_number) {
      return res.status(400).json({ message: 'phone_number is required' });
    }

    const facility = await Shift.findOne({ phone_number });

    if (!facility) {
      return res.status(404).json({ message: 'Facility not found' });
    }

    res.json({
      facility_id: facility.facility_id,
      hospital_name: facility.hospital_name,
      user_name: facility.user_name || '' // Return user_name if available
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
