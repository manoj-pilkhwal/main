const express = require('express');
const mongoose = require('mongoose');
//const { v4: uuidv4 } = require('uuid'); // to generate unique shift_id

const app = express();
app.use(express.json());

// Replace with your MongoDB Atlas connection string
const mongoURI = 'mongodb+srv://manojpilkhwal6:oSQ3l5hyHBFhgLhc@cluster0.w27johq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Example schema
const shiftSchema = new mongoose.Schema({
  facility_id: { type: String, required: true },
  hospital_name: { type: String, required: true },
  phone_number: { type: Number, required: true },
  shift_id: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  time: { type: String, required: true }
});

const Shift = mongoose.model('Shift', shiftSchema);

// Example POST endpoint to create a shift
app.post('/shifts', async (req, res) => {
  try {
    const { facility_id, date, time } = req.body;
    if (!facility_id || !date || !time) {
      return res.status(400).json({ success: false, message: 'facility_id, date, and time are required' });
    }
    // Find facility by facility_id
    const facility = await Shift.findOne({ facility_id });
    if (!facility) {
      return res.status(404).json({ success: false, message: 'Facility not found' });
    }
    // Create new shift (if you want to save shifts separately, use a new model; here we just update date/time)
    facility.date = date;
    facility.time = time;
    await facility.save();
    res.status(201).json({ success: true, message: 'Shift created successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
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
      hospital_name: facility.hospital_name
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
