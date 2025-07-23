const express = require('express');
const mongoose = require('mongoose');
const facilityRoutes = require('./routes/facilityRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Atlas connection
const mongoURI = 'mongodb+srv://manojpilkhwal6:oSQ3l5hyHBFhgLhc@cluster0.w27johq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Atlas connected'))
  .catch(err => console.error('MongoDB connection error:', err));
const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
  facility_id: { type: String, required: true },
  hospital_name: { type: String, required: true },
  phone_number: { type: Number, required: true },
  shift_id: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  time: { type: String, required: true }
});
// Example usage in a controller or route
const Shift = require('./path/to/your/shift/model'); // Adjust path if you move schema to its own file

const newShift = new Shift({
  facility_id: 'FAC12345',
  hospital_name: 'ABC Hospital',
  phone_number: '1234567890',
  shift_id: 'SHIFT9876',
  date: '06-25-2025',
  time: '03:00 PM'
});

newShift.save()
  .then(doc => console.log('Shift saved:', doc))
  .catch(err => console.error('Error saving shift:', err));

module.exports = mongoose.model('Shift', shiftSchema);
app.use(express.json());
app.use('/api/facilities', facilityRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});