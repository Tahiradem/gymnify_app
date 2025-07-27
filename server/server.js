require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// ------------------ CORS ------------------
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ------------------ MIDDLEWARE ------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------ DB CONNECTION ------------------
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};
connectDB();

<<<<<<< HEAD
// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/workout-time', require('./routes/workoutRoutes'));
app.use('/api/exercise-suggestions', require('./routes/exerciseSuggestionRouter'));
app.use('/api/workouts', require('./routes/workoutDataRouter'));
app.use('/api/reports', require('./routes/reportRoutes'));
=======
// ------------------ ROUTES ------------------
try {
  app.use('/api/auth', require('./routes/authRoutes'));
  app.use('/api/workouts', require('./routes/workoutRoutes'));
  app.use('/api/exercise-suggestions', require('./routes/exerciseSuggestionRouter'));
  app.use('/api/reports', require('./routes/reportRoutes'));
  console.log('✅ API routes loaded');
} catch (err) {
  console.error('❌ Error loading routes:', err);
}
>>>>>>> d8d1be300f0fbfc08039ba3abaf72b7fad9d8426

// ------------------ FRONTEND STATIC ------------------
// Serve React static files (Vite: dist, CRA: build)
const clientPath = path.join(__dirname, '../client/dist'); // Change to 'build' for CRA
app.use(express.static(clientPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

// ------------------ ERROR HANDLER ------------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// ------------------ START SERVER ------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
